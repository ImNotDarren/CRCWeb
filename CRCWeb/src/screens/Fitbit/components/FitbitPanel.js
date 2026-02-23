import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import getStyles from '../style.js';
import { Button } from '@ui-kitten/components';
import { Linking } from 'react-native';
import { getDailyActivitySummary, refreshToken } from '../../../../utils/fitbit.js';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from '../../../components/ProgressBar/index.js';
import Expand from '../../../components/Expand/index.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../../theme/colors.js';
import { alert } from '../../../../utils/alert.js';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
const FITBIT_OAUTH_REDIRECT_URL = process.env.EXPO_PUBLIC_FITBIT_OAUTH_REDIRECT_URL || '';

export default function FitbitPanel({ navigation }) {

  // const [activities, setActivities] = useState({});
  const [activitySummary, setActivitySummary] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const rotateAnimation = useState(new Animated.Value(0))[0];

  const user = useSelector(state => state.user);
  const fontSize = useSelector(state => state.font.fontSize);
  const styles = getStyles(fontSize);

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
      Animated.timing(rotateAnimation).stop();
    }
  }, [isLoading, rotateAnimation]);

  const getData = async (accessToken) => {
    if (accessToken && accessToken.access_token) {
      setIsLoading(true);
      try {
        // const act = await getActivitiesLogList(accessToken);

        const summary = await getDailyActivitySummary(accessToken);

        if (
          // act.errors ||
          summary.errors
        ) {
          if (
            // act.errors[0].message.includes('Access token expired') ||
            summary.errors[0].message.includes('Access token expired')
          ) {
            const newToken = await refreshToken(user);
            return dispatch({ type: 'UPDATE_ACCESS_TOKEN', value: newToken });
          }
          setIsLoading(false);
          return alert('Error',
            summary?.errors[0].message
            // || act?.errors[0].message
          );
        }

        // setActivities(act);
        setActivitySummary(summary);
        setIsLoading(false);

      } catch (err) {
        // alert('Error', err.message);
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
  };

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    if (Object.keys(activitySummary).length === 0
      // || Object.keys(activities).length === 0
    ) {
      // get(`fitbitAccessToken-${user.id}`).then((data) => {
      //   if (data) {
      //     getData(data);
      //   }
      // });
      if (user.accessToken && user.accessToken.access_token) {
        getData(user.accessToken);
      } else {
        fetch(`${SERVER_URL}/cbw/accesstokens/${user.user.id}`, {
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
              dispatch({ type: 'UPDATE_ACCESS_TOKEN', value: token })
              getData(token);
            }
          })
          .catch(error => console.error('Error:', error));
      }
    }
  }, [user.user]);

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
            <Button
              onPress={handleAuth}
              size='large'
              appearance='outline'
              status='info'
            >
              Connect Fitbit
            </Button>
          </View>
        }
      </View>
    </View>
  );
}