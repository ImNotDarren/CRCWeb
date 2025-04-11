import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { View, Alert } from 'react-native';
import { Button } from '@ui-kitten/components';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usePersistReduxState from '../../../hooks/usePersistReduxState';
import CustomMapView from './map';
import { Accelerometer } from 'expo-sensors';
import { alert } from '../../../utils/alert';
import Config from 'react-native-config';

const LOCATION_TASK_NAME = 'background-location-task';
const TRACKING_INTERVAL = 5000;
const MAX_LOCATIONS_ON_DEVICE = 100;
const AUTO_STOP_TIME = 7 * 24 * 60 * 60 * 1000; // one week

let currentAcc = { x: 0, y: 0, z: 0 };

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    try {
      const { locations } = data;
      const currentLocations = JSON.parse(await AsyncStorage.getItem('locations')) || [];
      currentLocations.push(locations[0]);

      const currentAccs = JSON.parse(await AsyncStorage.getItem('accelerometers')) || [];
      currentAccs.push({ ...currentAcc, timestamp: locations[0].timestamp });

      const startTime = await AsyncStorage.getItem('startTime');
      const currentTime = Date.now();

      if (currentTime - startTime >= AUTO_STOP_TIME) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        await AsyncStorage.setItem('updating', 'false');
      } else if (currentLocations.length >= MAX_LOCATIONS_ON_DEVICE) {
        await uploadActivities(currentLocations, currentAccs);
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

const uploadActivities = async (locations, accs) => {
  console.log('Uploading activities...', locations.length);
  const user = JSON.parse(await AsyncStorage.getItem('user'));

  let locationRes = await fetch(`${Config.SERVER_URL}/crc/locations/bulkCreate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locations,
      uid: user.id
    })
  });

  if (!locationRes.ok) {
    throw new Error(`HTTP error! status: ${locationRes.status}`);
  }

  let accelerometerRes = await fetch(`${Config.SERVER_URL}/crc/accelerometers/bulkCreate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accs,
      uid: user.id
    })
  });

  if (!accelerometerRes.ok) {
    throw new Error(`HTTP error! status: ${accelerometerRes.status}`);
  }
}

export default function LocationComponent() {
  const user = useSelector((state) => state.user.user);
  
  const locations = useSelector((state) => state.activity.locations);
  const accelerometers = useSelector((state) => state.activity.accelerometers);
  const [updating, setUpdating] = useState(false);
  const [currentAccState, setCurrentAccState] = useState({ x: 0, y: 0, z: 0 });

  const dispatch = useDispatch();

  useEffect(() => {
    checkPermissions();
    getUpdatingState();
  }, []);

  useEffect(() => {
    Accelerometer.setUpdateInterval(TRACKING_INTERVAL);
    const subscription = Accelerometer.addListener(accelerometerData => {
      currentAcc = accelerometerData; // Update the global accelerometer data
      setCurrentAccState(accelerometerData); // Update the component state
    });

    return () => subscription.remove();
  }, []);

  usePersistReduxState('server', server);
  usePersistReduxState('user', user);

  const checkPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (foregroundStatus !== 'granted' || backgroundStatus !== 'granted') {
      alert('Permission to access location was denied');
    }
  };

  const getUpdatingState = async () => {
    const updatingState = await AsyncStorage.getItem('updating');
    setUpdating(JSON.parse(updatingState));
    if (updatingState === 'true') {
      startLocationUpdates();
    }
  };

  const startLocationUpdates = async () => {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      alert('Background location permission is required.');
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

    const startTime = Date.now();
    await AsyncStorage.setItem('startTime', JSON.stringify(startTime));
    setUpdating(true);
    await AsyncStorage.setItem('updating', 'true');
  };

  const stopLocationUpdates = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    setUpdating(false);
    await AsyncStorage.setItem('updating', 'false');
    await AsyncStorage.setItem('locations', JSON.stringify([]));
    await AsyncStorage.setItem('accelerometers', JSON.stringify([]));
  };

  useEffect(() => {
    if (user?.id) {
      fetch(`${Config.SERVER_URL}/crc/locations/findAllByUserId/${user.id}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => {
          dispatch({ type: 'UPDATE_LOCATIONS', value: data });
        })
        .catch(error => console.error(error));
    }
  }, [user]);

  return (
    <View>
      <Button
        appearance='outline'
        onPress={updating ? stopLocationUpdates : startLocationUpdates}
      >
        {updating ? "Stop Location Updates" : "Start Location Updates"}
      </Button>

      {/* <CustomMapView
        locations={locations}
      /> */}
    </View>
  );
}
