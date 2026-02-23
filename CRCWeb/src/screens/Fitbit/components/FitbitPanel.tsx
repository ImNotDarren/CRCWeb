import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import getStyles from '../style';
import { AppButton } from '@/src/components/ui';
import { Linking } from 'react-native';
import { getDailyActivitySummary, refreshToken } from '@/utils/fitbit';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from '@/src/components/ProgressBar';
import Expand from '@/src/components/Expand';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { alert } from '@/utils/alert';
import type { RootState } from '@/src/types/store';
import type { FitbitAccessToken } from '@/utils/fitbit';
import { useColors } from '@/hooks/useColors';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
const FITBIT_OAUTH_REDIRECT_URL = process.env.EXPO_PUBLIC_FITBIT_OAUTH_REDIRECT_URL || '';

interface ActivitySummary {
  summary?: {
    steps?: number;
    lightlyActiveMinutes?: number;
    activityCalories?: number;
    distances?: Array<{ activity: string; distance?: number }>;
  };
  goals?: {
    steps?: number;
    activeMinutes?: number;
    distance?: number;
    activityCalories?: number;
  };
  errors?: Array<{ message: string }>;
}

export default function FitbitPanel(): React.ReactElement {
  const [activitySummary, setActivitySummary] = useState<ActivitySummary>({});
  const [isLoading, setIsLoading] = useState(false);
  const rotateAnimation = useState(new Animated.Value(0))[0];
  const user = useSelector((state: RootState) => state.user);
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnimation.setValue(0);
      Animated.timing(rotateAnimation, { toValue: 0, duration: 0, useNativeDriver: true }).stop();
    }
  }, [isLoading, rotateAnimation]);

  const getData = async (accessToken: FitbitAccessToken | null): Promise<void> => {
    if (!accessToken?.access_token) return;
    setIsLoading(true);
    try {
      const summary = (await getDailyActivitySummary(accessToken)) as ActivitySummary;
      if (summary.errors?.length) {
        if (summary.errors[0]?.message?.includes('Access token expired')) {
          const newToken = await refreshToken({
            user: { id: user.user?.id ?? 0 },
            accessToken,
          });
          dispatch({ type: 'UPDATE_ACCESS_TOKEN', value: newToken });
          return;
        }
        setIsLoading(false);
        alert('Error', summary?.errors[0]?.message);
        return;
      }
      setActivitySummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (): Promise<void> => {
    try {
      if (user.accessToken) {
        return await getData(user.accessToken as FitbitAccessToken);
      }
      await Linking.openURL(FITBIT_OAUTH_REDIRECT_URL);
    } catch (err) {
      console.error(err);
    }
  };

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    if (Object.keys(activitySummary).length === 0) {
      if (user.accessToken && (user.accessToken as FitbitAccessToken).access_token) {
        getData(user.accessToken as FitbitAccessToken);
      } else {
        fetch(`${SERVER_URL}/cbw/accesstokens/${user.user?.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => res.json())
          .then((data: { token?: string }) => {
            if (data.token) {
              const token = JSON.parse(data.token) as FitbitAccessToken | { errors?: unknown };
              if ('errors' in token && token.errors) return;
              dispatch({ type: 'UPDATE_ACCESS_TOKEN', value: token });
              getData(token as FitbitAccessToken);
            }
          })
          .catch((err) => console.error('Error:', err));
      }
    }
  }, [user.user?.id]);

  const steps = activitySummary?.summary?.steps ?? 0;
  const stepsGoal = activitySummary?.goals?.steps ?? 1000;
  const zoneMin = activitySummary?.summary?.lightlyActiveMinutes ?? 0;
  const zoneGoal = activitySummary?.goals?.activeMinutes ?? 30;
  const totalDist = activitySummary?.summary?.distances?.find((a) => a.activity === 'total')?.distance ?? 0;
  const distGoal = activitySummary?.goals?.distance ?? 10;
  const cal = activitySummary?.summary?.activityCalories ?? 0;
  const calGoal = activitySummary?.goals?.activityCalories ?? 2540;

  return (
    <View style={styles.fitbitPanelContainer}>
      <View style={styles.mainProgress}>
        {Object.keys(activitySummary).length > 0 ? (
          <>
            <View style={styles.topBar}>
              <Text style={styles.topBarTitle}>Today</Text>
              <TouchableOpacity onPress={handleAuth}>
                <Animated.View style={[styles.iconStyle, { transform: [{ rotate: rotation }] }]}>
                  <MaterialCommunityIcons name="refresh" size={25} color={colors.icon} />
                </Animated.View>
              </TouchableOpacity>
            </View>
            <ProgressBar title="Steps" curr={steps} goal={stepsGoal} size="big" />
            <View style={styles.subProgresses}>
              <ProgressBar title="Zone Min" curr={zoneMin} goal={zoneGoal} size="small" />
              <ProgressBar title="mi" curr={totalDist} goal={distGoal} size="small" />
              <ProgressBar title="cal" curr={cal} goal={calGoal} size="small" />
            </View>
            <View style={styles.bottomBar}>
              <Expand />
            </View>
          </>
        ) : (
          <View style={styles.connectFitbitContainer}>
            <AppButton onPress={handleAuth} appearance="outline">
              Connect Fitbit
            </AppButton>
          </View>
        )}
      </View>
    </View>
  );
}
