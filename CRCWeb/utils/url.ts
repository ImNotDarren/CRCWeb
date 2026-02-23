import { Linking } from 'react-native';

export const openURL = async (url: string): Promise<void> => {
  const bypassURLs = ['https://www.youtube.com', 'youtube:'];
  const supported = await Linking.canOpenURL(url);
  if (supported || bypassURLs.some((bypassURL) => url.startsWith(bypassURL))) {
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
