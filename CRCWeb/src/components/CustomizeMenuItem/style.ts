import { StyleSheet } from 'react-native';
import colors from '@/theme/colors';

const getStyles = (fontSize: number) =>
  StyleSheet.create({
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
      color: colors.grey[300],
      marginTop: 3,
    },
    progressBar: {
      marginRight: 10,
      width: 40,
      height: 40,
    },
  });

export default getStyles;
