import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useDispatch, useSelector } from 'react-redux';
import { extractCodeAndStateFromURL } from '@/utils/fitbit';
import { alert } from '@/utils/alert';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
const FITBIT_CLIENT_ID = process.env.EXPO_PUBLIC_FITBIT_CLIENT_ID || '';
const FITBIT_CODE_VERIFIER = process.env.EXPO_PUBLIC_FITBIT_CODE_VERIFIER || '';

export default function RedirectScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [status] = useState('Connecting Fitbit...');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const url = await Linking.getInitialURL();
      if (cancelled || !url || !url.includes('crcdata')) {
        router.replace('/(tabs)');
        return;
      }
      const { code } = extractCodeAndStateFromURL(url);
      if (!code) {
        router.replace('/(tabs)');
        return;
      }
      try {
        const res = await fetch('https://api.fitbit.com/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: FITBIT_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: 'crcdata://redirect',
            code,
            code_verifier: FITBIT_CODE_VERIFIER,
          }).toString(),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data.errors) {
          alert(data.errors[0].errorType, data.errors[0].message);
          router.replace('/(tabs)/fitbit');
          return;
        }
        if (user?.user?.id) {
          await fetch(`${SERVER_URL}/cbw/accesstokens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: JSON.stringify(data), uid: user.user.id }),
          });
        }
        dispatch({ type: 'UPDATE_ACCESS_TOKEN', value: data });
        router.replace('/(tabs)/fitbit');
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          router.replace('/(tabs)/fitbit');
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [router, dispatch, user?.user?.id]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12, fontSize: 16 }}>{status}</Text>
    </View>
  );
}
