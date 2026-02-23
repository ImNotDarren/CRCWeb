import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import FlashMessage from 'react-native-flash-message';
import * as Linking from 'expo-linking';
import { store } from '@/redux/store';
import { get } from '@/localStorage';
import { extractCodeAndStateFromURL } from '@/utils/fitbit';
import { alert } from '@/utils/alert';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
const FITBIT_CLIENT_ID = process.env.EXPO_PUBLIC_FITBIT_CLIENT_ID || '';
const FITBIT_CODE_VERIFIER = process.env.EXPO_PUBLIC_FITBIT_CODE_VERIFIER || '';

function FitbitRedirectListener() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const handleUrl = async ({ url }) => {
      if (!url?.includes('crcdata') || !url?.includes('redirect') || !url?.includes('code=')) return;
      const { code } = extractCodeAndStateFromURL(url);
      if (!code) return;
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
        console.error(err);
        router.replace('/(tabs)/fitbit');
      }
    };
    const sub = Linking.addEventListener('url', handleUrl);
    return () => sub.remove();
  }, [router, dispatch, user?.user?.id]);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const fontSize = await get('fontSize');
        if (fontSize != null) {
          store.dispatch({ type: 'UPDATE_FONTSIZE', value: fontSize });
        }
      } catch (_) {}
    };
    loadFontSize();
  }, []);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Provider store={store}>
        <FitbitRedirectListener />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="redirect" options={{ headerShown: false }} />
          <Stack.Screen name="login" />
          <Stack.Screen name="versions" />
          <Stack.Screen name="(tabs)" options={{ headerShown: true, headerTitleAlign: 'center' }} />
          <Stack.Screen name="how-to-navigate" options={{ headerShown: true, title: 'How To Navigate' }} />
          <Stack.Screen name="faq" options={{ headerShown: true, title: 'FAQ' }} />
          <Stack.Screen name="manage-accounts" options={{ headerShown: true, title: 'Manage Accounts' }} />
          <Stack.Screen name="add-user" options={{ headerShown: true, title: 'Add User', headerBackTitleVisible: false }} />
          <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
          <Stack.Screen name="content-home/[mid]" options={{ headerShown: true, headerBackTitleVisible: false }} />
          <Stack.Screen name="content-page" options={{ headerShown: true, headerBackTitleVisible: false }} />
          <Stack.Screen name="activity-page" options={{ headerShown: true, headerBackTitleVisible: false }} />
          <Stack.Screen name="quiz/[mid]" options={{ headerShown: true, gestureEnabled: false, headerBackVisible: false, headerBackTitleVisible: false }} />
          <Stack.Screen name="edit" options={{ headerShown: true, headerBackTitleVisible: false, presentation: 'modal' }} />
          <Stack.Screen name="user-info/[userId]" options={{ headerShown: true, headerBackTitleVisible: false, title: 'User Info' }} />
          <Stack.Screen name="user-locations" options={{ headerShown: true, headerBackTitleVisible: false, title: 'Locations' }} />
          <Stack.Screen name="activity" options={{ headerShown: true, headerBackTitleVisible: false, title: 'Physical Activity' }} />
          <Stack.Screen name="discussion" options={{ headerShown: true, headerBackTitleVisible: false }} />
          <Stack.Screen name="paired-accounts" options={{ headerShown: true, headerBackTitleVisible: false, title: 'Pairs' }} />
          <Stack.Screen name="pending-pairs" options={{ headerShown: true, headerBackTitleVisible: false, title: 'Pending Pairs' }} />
          <Stack.Screen name="contact" options={{ headerShown: true, headerBackTitleVisible: false, title: 'Contact Us' }} />
        </Stack>
        <FlashMessage position="top" />
      </Provider>
    </ApplicationProvider>
  );
}
