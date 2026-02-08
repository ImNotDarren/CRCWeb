import { StyleSheet } from "react-native";
import colors from "../../../theme/colors";

const getStyles = (fontSize) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    userinfoContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      margin: 20,
      // alignItems: 'center',
    },
    divider: {
      borderBottomColor: colors.grey[200],
      borderBottomWidth: 1,
      marginBottom: 20,
    },
    userinfo: (size) => ({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginLeft: 25,
      height: size,
    }),
    username: {
      fontSize: 22 + fontSize,
      marginBottom: 5,
    },
    email: {
      fontSize: 15 + fontSize,
      color: colors.grey[300],
    },
    role: {
      fontSize: 15 + fontSize,
      color: colors.grey[300],
      marginBottom: 2,
    },
    editButton: {
      marginHorizontal: 20,
    },
    menu: {
      backgroundColor: 'transparent',
      // borderRadius: 20,
      // paddingHorizontal: 20,
      // paddingTop: 35,
      height: '100%',
    },
    menuContainer: {
      display: 'flex',
      justifyContent: 'flex-start'
    },
    menuItem: {
      height: 70,
      borderRadius: 12,
      marginVertical: 6,
      justifyContent: 'flex-start',
      activeOpacity: 1,
    },
    MenuItemTitle: {
      fontSize: 18,
      // width: '100%',
      marginLeft: 10,
    },
  });
};

export default getStyles;