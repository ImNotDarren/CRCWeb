import { StyleSheet } from 'react-native';

const getStyles = (fontSize: number) =>
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
    },
    MenuItemTitle: { fontSize: 18 + fontSize, marginLeft: 10 },
  });

export default getStyles;
