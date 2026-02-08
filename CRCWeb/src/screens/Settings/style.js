import { StyleSheet } from "react-native"

const getStyles = (fontSize) => {
  return StyleSheet.create({
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
      activeOpacity: 1,
    },
    MenuItemTitle: {
      fontSize: 18 + fontSize,
      // width: '100%',
      marginLeft: 10,
    },
  });
};

export default getStyles;