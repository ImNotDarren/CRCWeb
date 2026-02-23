import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

const getStyles = (fontSize: number, colors: ThemeColors) =>
  StyleSheet.create({
    menu: {
      backgroundColor: 'transparent',
      height: '100%',
      paddingVertical: 20,
    },
    menuItem: {
      height: 70,
      borderRadius: 12,
      marginVertical: 6,
      justifyContent: 'flex-start',
      backgroundColor: colors.cardBackground,
    },
    MenuItemTitle: { fontSize: 18 + fontSize, marginLeft: 10, color: colors.text },
  });

export default getStyles;
