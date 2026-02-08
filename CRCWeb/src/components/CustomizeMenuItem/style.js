import { StyleSheet } from "react-native"
import colors from "../../../theme/colors";

const getStyles = (fontSize) => {
  return StyleSheet.create({
    menu: {
      backgroundColor: 'transparent',
      // borderRadius: 20,
      padding: 20,
      paddingTop: 35,
      height: '100%',
    },
    menuContainer: {
      display: 'flex',
      justifyContent: 'flex-start'
    },
    menuItem: {
      borderRadius: 12,
      marginVertical: 6,
      marginHorizontal: 20,
      justifyContent: 'flex-start',
      activeOpacity: 0.5,
      paddingVertical: 25,
      paddingHorizontal: 15,
    },
    titleView: {
      // width: '100%',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    MenuItemTitle: {
      fontSize: 18 + fontSize,
      // width: '100%',
      // paddingHorizontal: 15,
    },
    MenuItemSubtitle: {
      fontSize: 15 + fontSize,
      color: colors.grey[300],
      marginTop: 3,
      // width: '100%',
      // paddingHorizontal: 15,
    },
    progressBar: {
      marginRight: 10,
      width: 40,
      height: 40,
    }
  })
};

export default getStyles;