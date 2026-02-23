import { Colors, type SemanticColorKey } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: SemanticColorKey
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = theme === 'light' ? props.light : props.dark;

  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[theme][colorName];
}
