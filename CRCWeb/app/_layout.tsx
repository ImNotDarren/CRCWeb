import { useEffect, useLayoutEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import FlashMessage from 'react-native-flash-message';
import * as Linking from 'expo-linking';
import { store } from '@/redux/store';
import { get } from '@/localStorage';
import { extractCodeAndStateFromURL } from '@/utils/fitbit';
import { alert } from '@/utils/alert';
import type { RootState } from '@/src/types/store';
import { Colors, type ColorScheme } from '@/constants/Colors';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
const FITBIT_CLIENT_ID = process.env.EXPO_PUBLIC_FITBIT_CLIENT_ID || '';
const FITBIT_CODE_VERIFIER = process.env.EXPO_PUBLIC_FITBIT_CODE_VERIFIER || '';

function FitbitRedirectListener(): null {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }): Promise<void> => {
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

function ThemeWrapper(): React.ReactElement {
  const colorScheme = useColorScheme();
  const navTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme: ColorScheme = colorScheme === 'dark' ? 'dark' : 'light';
  const backgroundColor = Colors[theme].background;

  useLayoutEffect(() => {
    void SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [backgroundColor]);

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <FitbitRedirectListener />
      <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor },
            statusBarStyle: colorScheme === 'dark' ? 'light' : 'dark',
          }}
        >
        <Stack.Screen name="index" />
        <Stack.Screen name="redirect" options={{ headerShown: false }} />
        <Stack.Screen name="login" />
        <Stack.Screen name="versions" />
        <Stack.Screen name="(tabs)" options={{ headerShown: true, headerTitleAlign: 'center' }} />
        <Stack.Screen name="how-to-navigate" options={{ headerShown: true, title: 'How To Navigate' }} />
        <Stack.Screen name="faq" options={{ headerShown: true, title: 'FAQ' }} />
        <Stack.Screen name="manage-accounts" options={{ headerShown: true, title: 'Manage Accounts' }} />
        <Stack.Screen name="add-user" options={{ headerShown: true, title: 'Add User', headerBackTitleVisible: false } as object} />
        <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
        <Stack.Screen name="content-home/[mid]" options={{ headerShown: true, headerBackTitleVisible: false } as object} />
        <Stack.Screen name="content-page" options={{ headerShown: true, headerBackTitleVisible: false } as object} />
        <Stack.Screen name="activity-page" options={{ headerShown: true, headerBackTitleVisible: false } as object} />
        <Stack.Screen name="quiz/[mid]" options={{ headerShown: true, gestureEnabled: false, headerBackVisible: false, headerBackTitleVisible: false } as object} />
        <Stack.Screen name="edit" options={{ headerShown: true, headerBackTitleVisible: false, presentation: 'modal' } as object} />
        <Stack.Screen name="user-info/[userId]" options={{ headerShown: true, headerBackTitleVisible: false, title: 'User Info' } as object} />
        <Stack.Screen name="user-locations" options={{ headerShown: true, headerBackTitleVisible: false, title: 'Locations' } as object} />
        <Stack.Screen name="activity" options={{ headerShown: true, headerBackTitleVisible: false, title: 'Physical Activity' } as object} />
        <Stack.Screen name="discussion" options={{ headerShown: true, headerBackTitleVisible: false } as object} />
        <Stack.Screen name="paired-accounts" options={{ headerShown: true, headerBackTitleVisible: false, title: 'Pairs' } as object} />
        <Stack.Screen name="pending-pairs" options={{ headerShown: true, headerBackTitleVisible: false, title: 'Pending Pairs' } as object} />
        <Stack.Screen name="contact" options={{ headerShown: true, headerBackTitleVisible: false, title: 'Contact Us' } as object} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout(): React.ReactElement {
  useEffect(() => {
    const loadFontSize = async (): Promise<void> => {
      try {
        const fontSize = await get('fontSize');
        if (fontSize != null) {
          store.dispatch({ type: 'UPDATE_FONTSIZE', value: fontSize as 'small' | 'medium' | 'large' });
        }
      } catch {
        // ignore
      }
    };
    loadFontSize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeWrapper />
        <FlashMessage position="top" />
      </Provider>
    </GestureHandlerRootView>
  );
}
