import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'react-native';
import { AppButton } from '@/src/components/ui';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usePersistReduxState from '@/hooks/usePersistReduxState';
import { Accelerometer } from 'expo-sensors';
import { alert } from '@/utils/alert';
import type { RootState } from '@/src/types/store';
import type { CRCLocation } from '@/src/types/crc';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
const LOCATION_TASK_NAME = 'background-location-task';
const TRACKING_INTERVAL = 5000;
const MAX_LOCATIONS_ON_DEVICE = 100;
const AUTO_STOP_TIME = 7 * 24 * 60 * 60 * 1000;

let currentAcc = { x: 0, y: 0, z: 0 };

interface LocationTaskData {
  locations: Array<{ timestamp: number; coords: { latitude: number; longitude: number; accuracy: number; altitude: number; altitudeAccuracy: number; heading: number; speed: number } }>;
}

TaskManager.defineTask(LOCATION_TASK_NAME, async (event) => {
  const { data, error } = event as { data?: LocationTaskData; error?: Error | null };
  if (error) {
    console.error(error);
    return;
  }
  if (data?.locations?.length) {
    try {
      const locations = data.locations;
      const currentLocations: unknown[] = JSON.parse((await AsyncStorage.getItem('locations')) || '[]');
      currentLocations.push(locations[0]);

      const currentAccs: unknown[] = JSON.parse((await AsyncStorage.getItem('accelerometers')) || '[]');
      currentAccs.push({ ...currentAcc, timestamp: locations[0].timestamp });

      const startTimeStr = await AsyncStorage.getItem('startTime');
      const startTime = startTimeStr ? parseInt(startTimeStr, 10) : 0;
      const currentTime = Date.now();

      if (currentTime - startTime >= AUTO_STOP_TIME) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        await AsyncStorage.setItem('updating', 'false');
      } else if (currentLocations.length >= MAX_LOCATIONS_ON_DEVICE) {
        await uploadActivities(currentLocations as CRCLocation[], currentAccs);
        await AsyncStorage.setItem('locations', JSON.stringify([]));
        await AsyncStorage.setItem('accelerometers', JSON.stringify([]));
      } else {
        await AsyncStorage.setItem('locations', JSON.stringify(currentLocations));
        await AsyncStorage.setItem('accelerometers', JSON.stringify(currentAccs));
      }
    } catch (err) {
      console.error(err);
    }
  }
});

const uploadActivities = async (locations: CRCLocation[], accs: unknown[]): Promise<void> => {
  const userStr = await AsyncStorage.getItem('user');
  const user = userStr ? (JSON.parse(userStr) as { id: number }) : null;
  if (!user?.id) return;

  const locationRes = await fetch(`${SERVER_URL}/crc/locations/bulkCreate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locations, uid: user.id }),
  });
  if (!locationRes.ok) throw new Error(`HTTP error! status: ${locationRes.status}`);

  const accelerometerRes = await fetch(`${SERVER_URL}/crc/accelerometers/bulkCreate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accs, uid: user.id }),
  });
  if (!accelerometerRes.ok) throw new Error(`HTTP error! status: ${accelerometerRes.status}`);
};

export default function LocationComponent(): React.ReactElement {
  const user = useSelector((state: RootState) => state.user.user);
  const [updating, setUpdating] = useState(false);
  const [, setCurrentAccState] = useState({ x: 0, y: 0, z: 0 });
  const dispatch = useDispatch();

  useEffect(() => {
    void checkPermissions();
    void getUpdatingState();
  }, []);

  useEffect(() => {
    Accelerometer.setUpdateInterval(TRACKING_INTERVAL);
    const subscription = Accelerometer.addListener((accelerometerData: { x: number; y: number; z: number }) => {
      currentAcc = accelerometerData;
      setCurrentAccState(accelerometerData);
    });
    return () => subscription.remove();
  }, []);

  usePersistReduxState('user', user);

  const checkPermissions = async (): Promise<void> => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (foregroundStatus !== 'granted' || backgroundStatus !== 'granted') {
      alert('Permission to access location was denied', undefined);
    }
  };

  const getUpdatingState = async (): Promise<void> => {
    const updatingState = await AsyncStorage.getItem('updating');
    setUpdating(updatingState === 'true');
    if (updatingState === 'true') {
      await startLocationUpdates();
    }
  };

  const startLocationUpdates = async (): Promise<void> => {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      alert('Background location permission is required.', undefined);
      return;
    }
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: TRACKING_INTERVAL,
      distanceInterval: 0,
      foregroundService: {
        notificationTitle: 'Location Tracking',
        notificationBody: 'Your location is being tracked in the background.',
      },
    });
    await AsyncStorage.setItem('startTime', String(Date.now()));
    setUpdating(true);
    await AsyncStorage.setItem('updating', 'true');
  };

  const stopLocationUpdates = async (): Promise<void> => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    setUpdating(false);
    await AsyncStorage.setItem('updating', 'false');
    await AsyncStorage.setItem('locations', JSON.stringify([]));
    await AsyncStorage.setItem('accelerometers', JSON.stringify([]));
  };

  useEffect(() => {
    if (user?.id) {
      fetch(`${SERVER_URL}/crc/locations/findAllByUserId/${user.id}`, { method: 'GET' })
        .then((res) => res.json())
        .then((data: CRCLocation[]) => dispatch({ type: 'UPDATE_LOCATIONS', value: data }))
        .catch((err) => console.error(err));
    }
  }, [user?.id, dispatch]);

  return (
    <View>
      <AppButton appearance="outline" onPress={updating ? stopLocationUpdates : startLocationUpdates}>
        {updating ? 'Stop Location Updates' : 'Start Location Updates'}
      </AppButton>
    </View>
  );
}
