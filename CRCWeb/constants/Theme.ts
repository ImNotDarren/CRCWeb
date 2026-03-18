import type { Theme } from '@react-navigation/native';
import { Colors, type ColorScheme } from '@/constants/Colors';

/**
 * React Navigation themes using our app colors so the default background
 * (e.g. tab scene container) is our theme color, not white.
 */
function buildNavTheme(scheme: ColorScheme): Theme {
  const c = Colors[scheme];
  return {
    dark: scheme === 'dark',
    colors: {
      primary: c.primary,
      background: c.background,
      card: c.background,
      text: c.text,
      border: c.border,
      notification: c.primary,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '900' as const },
    },
  };
}

export const LightNavTheme = buildNavTheme('light');
export const DarkNavTheme = buildNavTheme('dark');
