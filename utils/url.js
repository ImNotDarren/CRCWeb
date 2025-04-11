import { Linking } from "react-native";

export const openURL = async (url) => {
  const bypassURLs = ['https://www.youtube.com', 'youtube:'];

  const supported = await Linking.canOpenURL(url);

  if (supported || bypassURLs.some((bypassURL) => url.startsWith(bypassURL))){
    await Linking.openURL(url);
  } else {
    console.error(`Don't know how to open this URL: ${url}`);
  }
};


export const removeUrls = (input) => {
  // This regex matches any sequence of newline characters followed by the entire URLs starting with 'http:// or 'https://'
  var regex = /(\n*)(?:\s*)(https?:\/\/[^\s]+)/g;
  return input.replace(regex, '').trim();
};


export const extractUrl = (input) => {
  var regex = /(https?:\/\/[^\s]+)/;
  var match = input.match(regex);
  // If a match is found, return it; otherwise return null to indicate no URL was found
  return match ? match[0] : null;
};