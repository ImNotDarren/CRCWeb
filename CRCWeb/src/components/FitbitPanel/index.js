import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import getStyles from './style.js';
import { Linking } from 'react-native';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { refreshToken, getDailyActivitySummary } from '../../../utils/fitbit.js';
import ProgressBar from '../ProgressBar/index.js';
import Expand from '../Expand/index.js';
import colors from '../../../theme/colors.js';

import { FITBIT_OAUTH_REDIRECT_URL, SERVER_URL } from '../../../constants.js';

export default function FitbitPanel({ user }) {

  // const [activities, setActivities] = useState({});
  const [activitySummary, setActivitySummary] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const rotateAnimation = useState(new Animated.Value(0))[0];

  const fontSize = useSelector(state => state.font.fontSize);
  const styles = getStyles(fontSize);

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
      Animated.timing(rotateAnimation).stop();
    }
  }, [isLoading, rotateAnimation]);

  const getData = async (at) => {
    if (at && at.access_token) {
      setIsLoading(true);
      try {
        // const act = await getActivitiesLogList(at);

        const summary = await getDailyActivitySummary(at);

        if (summary.errors) {
          if (summary.errors[0].message.includes('Access token expired')) {
            const newToken = await refreshToken({ user, accessToken: at });
            return getData(newToken);
          }
          setIsLoading(false);
          console.error(summary?.errors[0].message);
          return;
        }
        setActivitySummary(summary);
        setIsLoading(false);

      } catch (err) {
        console.error(err);
      }
    }

  };

  const handleAuth = async () => {
    try {
      if (user.accessToken) {
        return await getData(user.accessToken);
      }
      Linking.openURL(FITBIT_OAUTH_REDIRECT_URL);
    } catch (err) {
      console.error(err);
    }
  }

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Rotate from 0 to 360 degrees
  });

  useEffect(() => {
    fetch(`${SERVER_URL}/cbw/accesstokens/${user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          const token = JSON.parse(data.token);
          if (token.errors)
            return;
          setAccessToken(token);
          getData(token);
        }
      })
      .catch(error => console.error('Error:', error));
  }, [user]);

  return (
    <View style={styles.fitbitPanelContainer}>
      <View style={styles.mainProgress}>
        {Object.keys(activitySummary).length > 0 ?
          <>
            <View style={styles.topBar}>
              <Text style={styles.topBarTitle}>Today</Text>
              {/* <Expand /> */}
              <TouchableOpacity onPress={handleAuth}>
                <Animated.View
                  style={[styles.iconStyle, { transform: [{ rotate: rotation }] }]}
                >
                  <MaterialCommunityIcons name='refresh' size={25} color={colors.grey[300]} />
                </Animated.View>
              </TouchableOpacity>
            </View>
            <ProgressBar title='Steps' curr={activitySummary?.summary?.steps ?? 0} goal={activitySummary?.goals?.steps ?? 1000} size='big' />
            <View style={styles.subProgresses}>

              <ProgressBar title='Zone Min' curr={activitySummary?.summary?.lightlyActiveMinutes ?? 0} goal={activitySummary?.goals?.activeMinutes ?? 30} size='small' />

              <ProgressBar title='mi' curr={activitySummary?.summary?.distances.find((act) => act.activity === 'total').distance ?? 0} goal={activitySummary?.goals?.distance ?? 10} size='small' />

              <ProgressBar title='cal' curr={activitySummary?.summary?.activityCalories ?? 0} goal={activitySummary?.goals?.activityCalories ?? 2540} size='small' />

            </View>
            <View style={styles.bottomBar}>
              <Expand />
              {/* <MaterialCommunityIcons name='chevron-right' size={25} color={colors.grey[400]} /> */}
            </View>
          </> :
          <View style={styles.connectFitbitContainer}>
            <Text>No Access Token</Text>
          </View>
        }
      </View>
    </View>
  );
}