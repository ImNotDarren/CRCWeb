import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useDispatch, useSelector } from 'react-redux';
import { extractCodeAndStateFromURL } from '@/utils/fitbit';
import { alert } from '@/utils/alert';
import type { RootState } from '@/src/types/store';
import { useColors } from '@/hooks/useColors';
import { ThemedView } from '@/src/components/ThemedView';
import { save } from '@/localStorage';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
const FITBIT_CLIENT_ID = process.env.EXPO_PUBLIC_FITBIT_CLIENT_ID || '';
const FITBIT_CODE_VERIFIER = process.env.EXPO_PUBLIC_FITBIT_CODE_VERIFIER || '';

export default function RedirectScreen(): React.ReactElement {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const colors = useColors();
  const [status] = useState('Connecting Fitbit...');

  useEffect(() => {
    let cancelled = false;
    const run = async (): Promise<void> => {
      const url = await Linking.getInitialURL();
      if (cancelled || !url || !url.includes('redirect') || !url.includes('code=')) {
        router.replace('/');
        return;
      }
      const { code } = extractCodeAndStateFromURL(url);
      if (!code) {
        router.replace('/');
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
          router.replace('/');
          return;
        }
        await save('fitbitAccessToken', JSON.stringify(data));
        dispatch({ type: 'UPDATE_ACCESS_TOKEN', value: data });
        // Always navigate to root; auth flow handles login then user reaches fitbit tab
        // Token is persisted in AsyncStorage for later use
        router.replace('/');
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          router.replace('/');
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    // No user?.user?.id dep — cold start always has null user; avoid re-running when user logs in
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, dispatch]);

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12, fontSize: 16, color: colors.text }}>{status}</Text>
    </ThemedView>
  );
}
