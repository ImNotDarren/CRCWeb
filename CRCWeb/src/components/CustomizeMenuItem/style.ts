import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

export default function getStyles(fontSize: number, colors: ThemeColors) {
  return StyleSheet.create({
    menu: {
      backgroundColor: 'transparent',
      padding: 20,
      paddingTop: 35,
      height: '100%',
    },
    menuContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
    },
    menuItem: {
      borderRadius: 12,
      marginVertical: 6,
      marginHorizontal: 20,
      justifyContent: 'flex-start',
      paddingVertical: 25,
      paddingHorizontal: 15,
    },
    titleView: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    MenuItemTitle: {
      fontSize: 18 + fontSize,
    },
    MenuItemSubtitle: {
      fontSize: 15 + fontSize,
      color: colors.mutedText,
      marginTop: 3,
    },
    progressBar: {
      marginRight: 10,
      width: 40,
      height: 40,
    },
  });
}
