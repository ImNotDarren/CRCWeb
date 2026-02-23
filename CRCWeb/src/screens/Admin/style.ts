import { Dimensions, StyleSheet } from "react-native";
import colors from "@/theme/colors";

const getStyles = (fontSize: number) => {
  return StyleSheet.create({
    inputView: {
      marginHorizontal: 20,
      marginTop: 20,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputText: {
      height: 35,
      fontSize: 20,
    },
    searchButton: {
      marginLeft: 10,
    },
    container: {
      marginVertical: 20,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    loginCount: {
      fontSize: 15,
      color: colors.grey[300],
    },
    addUserContainer: {
      padding: 20,
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
      marginLeft: 3,
      color: colors.grey[400],
    },
    input: {
      marginBottom: 20,
      flex: 1,
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      margin: 20,
      marginBottom: 40,
    },
    bottomWhiteSpace: {
      height: 40,
    },
  });
};

export default getStyles;
