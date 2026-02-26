import { Appearance, useColorScheme as useRNColorScheme } from 'react-native';

/**
 * useColorScheme with Android fallback: on Android the native hook can return null.
 * We fall back to Appearance.getColorScheme() so dark mode is respected.
 */
export function useColorScheme(): 'light' | 'dark' {
  const scheme = useRNColorScheme();
  return scheme ?? Appearance.getColorScheme() ?? 'light';
}
