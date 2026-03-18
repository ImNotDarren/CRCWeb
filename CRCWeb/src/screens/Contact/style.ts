import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

export default function getStyles(fontSize: number, colors: ThemeColors) {
  return StyleSheet.create({
    container: { padding: 20 },
    title: {
      fontSize: 22 + fontSize,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: colors.text,
    },
  });
}
