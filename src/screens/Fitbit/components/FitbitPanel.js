import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import getStyles from '../style.js';
import { Button } from '@ui-kitten/components';
import { Linking } from 'react-native';
import * as ExpoLinking from 'expo-linking';
import { extractCodeAndStateFromURL, getActivitiesLogList, getDailyActivitySummary, refreshToken } from '../../../../utils/fitbit.js';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from '../../../components/ProgressBar/index.js';
import Expand from '../../../components/Expand/index.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../../theme/colors.js';
import { alert } from '../../../../utils/alert.js';
import Config from 'react-native-config';

export default function FitbitPanel({ navigation }) {

  // const [activities, setActivities] = useState({});
  const [activitySummary, setActivitySummary] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const rotateAnimation = useState(new Animated.Value(0))[0];

  const user = useSelector(state => state.user);
  const server = useSelector(state => state.server.url);
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
      Linking.openURL(Config.FITBIT_OAUTH_REDIRECT_URL);
    } catch (err) {
      console.error(err);
    }
  }

  const rotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Rotate from 0 to 360 degrees
  });

  useEffect(() => {
    const handleDeepLink = (event) => {
      const { code, state } = extractCodeAndStateFromURL(event.url);
      // console.log(code, state);
      fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: Config.FITBIT_CLIENT_ID,
          grant_type: 'authorization_code',
          redirect_uri: 'crcdata://redirect',
          code: code,
          code_verifier: Config.FITBIT_CODE_VERIFIER,
        }).toString()
      })
        .then(response => response.json())
        .then(async (data) => {
          // save access token in local storage
          // save(`fitbitAccessToken-${user.id}`, data, data.expires_in);
          if (data.errors)
            return alert(data.errors[0].errorType, data.errors[0].message);

          const res = await fetch(`${Config.SERVER_URL}/cbw/accesstokens`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: JSON.stringify(data), uid: user.user.id })
          });

          dispatch({ type: 'UPDATE_ACCESS_TOKEN', value: data })

          const resData = await res.json();

          if (resData.message)
            return alert('Error', resData.message);

          await getData(data);
        })
        .catch(error => console.error('Error:', error));
    };

    ExpoLinking.addEventListener('url', handleDeepLink);

    // Handle the initial URL
    ExpoLinking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      if (ExpoLinking.removeEventListener) {
        ExpoLinking.removeEventListener('url', handleDeepLink);
      }
    };
  }, []);

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
        fetch(`${Config.SERVER_URL}/cbw/accesstokens/${user.user.id}`, {
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
  }, [user.user, server]);

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