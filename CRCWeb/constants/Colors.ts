/**
 * App colors – flat semantic keys only. Use useColors() or useThemeColor() for light/dark.
 */

const tintLight = '#2462f2';
const tintDark = '#5b8af5'; // blue accent for dark mode

export const Colors = {
  light: {
    background: '#F2F2F7',
    back: '#F2F2F7',
    cardBackground: '#ffffff',
    cardBorder: '#e5e7eb',
    text: '#212121',
    secondaryText: '#575757',
    mutedText: '#919191',
    label: '#444444',
    border: '#d1d5db',
    borderLight: '#e5e7eb',
    divider: '#e5e7eb',
    primary: '#4c7ff5',
    primaryLight: '#bbe2fc',
    primaryDark: '#2462f2',
    link: tintLight,
    tabIconDefault: '#919191',
    tabIconSelected: tintLight,
    inputBackground: '#f3f4f6',
    inputPlaceholder: '#919191',
    success: '#009900',
    error: '#d4192a',
    floatingActionButton: '#4c7ff5',
    icon: '#919191',
    onPrimary: '#ffffff',
    inputOverlay: 'rgba(255,255,255,0.6)',
  },
  dark: {
    background: '#0a0a0a',
    back: '#0a0a0a',
    cardBackground: '#171717',
    cardBorder: '#262626',
    text: '#fafafa',
    secondaryText: '#a3a3a3',
    mutedText: '#71717a',
    label: '#d4d4d8',
    border: '#404040',
    borderLight: '#262626',
    divider: '#404040',
    primary: '#5b8af5',
    primaryLight: '#0d1f4a',
    primaryDark: '#2f64e3',
    link: tintDark,
    tabIconDefault: '#71717a',
    tabIconSelected: tintDark,
    inputBackground: '#262626',
    inputPlaceholder: '#71717a',
    success: '#4ade80',
    error: '#f87171',
    floatingActionButton: '#2f64e3',
    icon: '#a3a3a3',
    onPrimary: '#ffffff',
    inputOverlay: 'rgba(255,255,255,0.12)',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
/** Keys that resolve to a string color (for useThemeColor). */
export type SemanticColorKey = keyof typeof Colors.light;
export type ThemeColors = (typeof Colors)[ColorScheme];
