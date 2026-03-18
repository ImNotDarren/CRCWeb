import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Linking } from 'react-native';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { refreshToken, getDailyActivitySummary } from '@/utils/fitbit';
import ProgressBar from '@/src/components/ProgressBar';
import Expand from '@/src/components/Expand';
import getStyles from './style';
import type { RootState } from '@/src/types/store';
import type { FitbitAccessToken } from '@/utils/fitbit';
import type { User } from '@/src/types/common';
import { useColors } from '@/hooks/useColors';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
const FITBIT_OAUTH_REDIRECT_URL = process.env.EXPO_PUBLIC_FITBIT_OAUTH_REDIRECT_URL || '';

interface FitbitPanelProps {
  user: { id: number; accessToken?: FitbitAccessToken | null };
}

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

export default function FitbitPanel({ user }: FitbitPanelProps): React.ReactElement {
  const [activitySummary, setActivitySummary] = useState<ActivitySummary>({});
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<FitbitAccessToken | null>(null);
  const rotateAnimation = useState(new Animated.Value(0))[0];
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);

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

  const getData: (at: FitbitAccessToken | null) => Promise<void> = async (at) => {
    if (!at?.access_token) return;
    setIsLoading(true);
    try {
      const summary = (await getDailyActivitySummary(at)) as ActivitySummary;
      if (summary.errors) {
        if (summary.errors[0]?.message?.includes('Access token expired')) {
          const newToken = await refreshToken({
            user: { id: user.id },
            accessToken: at,
          });
          return getData(newToken);
        }
        setIsLoading(false);
        console.error(summary?.errors[0]?.message);
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
      if (user.accessToken) return await getData(user.accessToken);
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
    fetch(`${SERVER_URL}/cbw/accesstokens/${user.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data: { token?: string }) => {
        if (data.token) {
          const token = JSON.parse(data.token) as FitbitAccessToken | { errors?: unknown };
          if ('errors' in token && token.errors) return;
          setAccessToken(token as FitbitAccessToken);
          getData(token as FitbitAccessToken);
        }
      })
      .catch((err) => console.error('Error:', err));
  }, [user.id]);

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
            <Text>No Access Token</Text>
          </View>
        )}
      </View>
    </View>
  );
}
