import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

const getStyles = (fontSize: number, colors: ThemeColors) =>
  StyleSheet.create({
    container: { paddingVertical: 20, backgroundColor: colors.background },
  });

export default getStyles;
