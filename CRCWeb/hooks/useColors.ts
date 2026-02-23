import { useMemo } from 'react';
import { Colors, type ColorScheme, type ThemeColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useColors(): ThemeColors {
  const scheme = useColorScheme();
  const theme: ColorScheme = scheme === 'dark' ? 'dark' : 'light';
  const result = useMemo(() => Colors[theme], [theme]);
  return result;
}
