import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

export function getBadgeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.error,
      position: 'absolute',
      top: 0,
      right: 5,
      height: 10,
      width: 10,
      borderRadius: 5,
    },
  });
}
