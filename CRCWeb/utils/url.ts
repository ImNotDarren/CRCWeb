import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const FITBIT_OAUTH_REDIRECT_URL = process.env.EXPO_PUBLIC_FITBIT_OAUTH_REDIRECT_URL || '';

export const openURL = async (url: string): Promise<void> => {
  const isHttpUrl = url.startsWith('http://') || url.startsWith('https://');
  const isFitbitAuth = FITBIT_OAUTH_REDIRECT_URL && url.startsWith(FITBIT_OAUTH_REDIRECT_URL);
  const externalURLs = ['https://www.youtube.com', 'youtube:'];
  const shouldOpenExternally = externalURLs.some((prefix) => url.startsWith(prefix));

  if (isHttpUrl && !isFitbitAuth && !shouldOpenExternally) {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (err) {
      console.error(`Failed to open URL in browser: ${url}`, err);
    }
    return;
  }

  const supported = await Linking.canOpenURL(url);
  if (supported || shouldOpenExternally) {
    await Linking.openURL(url);
  } else {
    console.error(`Don't know how to open this URL: ${url}`);
  }
};

export const removeUrls = (input: string): string => {
  const regex = /(\n*)(?:\s*)(https?:\/\/[^\s]+)/g;
  return input.replace(regex, '').trim();
};

export const extractUrl = (input: string): string | null => {
  const regex = /(https?:\/\/[^\s]+)/;
  const match = input.match(regex);
  return match ? match[0] : null;
};
