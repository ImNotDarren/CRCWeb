import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

const getStyles = (fontSize: number, colors: ThemeColors) =>
  StyleSheet.create({
    container: { padding: 20, backgroundColor: colors.background },
    title: { fontSize: 24 + fontSize, marginBottom: 20, color: colors.text },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
      paddingHorizontal: 20,
    },
  });

export default getStyles;
