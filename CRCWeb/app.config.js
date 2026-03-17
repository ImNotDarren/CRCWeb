const path = require('path');

try {
  require('dotenv').config({ path: path.resolve(__dirname, '.env') });
} catch (_) {}

module.exports = ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: 'CRCWeb',
    slug: 'CRCWeb',
    version: '1.0.1',
    scheme: 'crcdata',
    newArchEnabled: true,
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    splash: {
      ...config.expo?.splash,
      backgroundColor: '#0a0a0a',
    },
    runtimeVersion: '1.0.1',
    updates: {
      url: 'https://u.expo.dev/d52b3498-bba2-4bf9-ac1e-c8ce31c8d87d',
      enabled: true,
      fallbackToCacheTimeout: 0,
      requestHeaders: {
        'expo-channel-name': 'production',
      },
    },
    ios: {
      ...config.expo?.ios,
      userInterfaceStyle: 'automatic',
      bundleIdentifier: 'com.anonymous.CRCData',
      supportsTablet: true,
      buildNumber: '1',
      infoPlist: {
        ...config.expo?.ios?.infoPlist,
        NSLocationWhenInUseUsageDescription:
          'This app uses your location to provide navigation directions.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'This app uses your location to provide location tracking even when the app is not in use.',
        NSLocationAlwaysUsageDescription: 'Allow $(PRODUCT_NAME) to access your location',
        NSMotionUsageDescription: 'Allow $(PRODUCT_NAME) to access your device motion',
        UIBackgroundModes: ['location', 'fetch'],
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSAllowsArbitraryLoadsInWebContent: true,
          NSAllowsLocalNetworking: true,
          NSExceptionDomains: {
            localhost: {
              NSExceptionAllowsInsecureHTTPLoads: true,
            },
          },
        },
        ITSAppUsesNonExemptEncryption: false,
        LSApplicationQueriesSchemes: ['fb', 'whatsapp', 'sms', 'mailto'],
        UIRequiresFullScreen: false,
        UIViewControllerBasedStatusBarAppearance: true,
        UISupportedInterfaceOrientations: ['UIInterfaceOrientationPortrait'],
        UIUserInterfaceStyle: 'Automatic',
        'UISupportedInterfaceOrientations~ipad': [
          'UIInterfaceOrientationLandscapeLeft',
          'UIInterfaceOrientationLandscapeRight',
          'UIInterfaceOrientationPortrait',
          'UIInterfaceOrientationPortraitUpsideDown',
        ],
      },
    },
    android: {
      ...config.expo?.android,
      userInterfaceStyle: 'automatic',
      package: 'com.anonymous.CRCData',
      versionCode: 3,
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'FOREGROUND_SERVICE',
        'FOREGROUND_SERVICE_LOCATION',
        'READ_EXTERNAL_STORAGE',
        'SYSTEM_ALERT_WINDOW',
        'WRITE_EXTERNAL_STORAGE',
        'RECEIVE_BOOT_COMPLETED',
        'WAKE_LOCK',
        'VIBRATE',
        'USE_EXACT_ALARM',
      ],
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          category: ['BROWSABLE', 'DEFAULT'],
          data: [
            { scheme: 'crcdata', host: 'redirect' },
            { scheme: 'com.anonymous.CRCData' },
            { scheme: 'https', host: '*' },
            { scheme: 'http' },
            { scheme: 'youtube' },
            { scheme: 'fb' },
            { scheme: 'sms' },
            { scheme: 'whatsapp' },
            { scheme: 'mailto' },
          ],
        },
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyAZ_yqhkL6xQQKiKt4Got1lLG3tRyHF38M',
        },
      },
    },
    plugins: [
      [
        'expo-build-properties',
        {
          ios: {
            deploymentTarget: '15.1',
          },
        },
      ],
      './plugins/withIosEntitlements',
      'expo-web-browser',
    ],
    extra: {
      ...config.expo?.extra,
      SERVER_URL: process.env.EXPO_PUBLIC_SERVER_URL || '',
      FITBIT_OAUTH_REDIRECT_URL: process.env.EXPO_PUBLIC_FITBIT_OAUTH_REDIRECT_URL || '',
      FITBIT_CLIENT_ID: process.env.EXPO_PUBLIC_FITBIT_CLIENT_ID || '',
      FITBIT_CODE_VERIFIER: process.env.EXPO_PUBLIC_FITBIT_CODE_VERIFIER || '',
      GITHUB_BUCKET: process.env.EXPO_PUBLIC_GITHUB_BUCKET || '',
    },
  },
});
