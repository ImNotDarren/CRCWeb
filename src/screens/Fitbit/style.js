import { StyleSheet } from "react-native"
import colors from "../../../theme/colors";

const getStyles = (fontSize) => {
  return StyleSheet.create({
    container: {
      padding: 20,
    },
    fitbitPanelContainer: {
      backgroundColor: colors.white,
      // height: 400,
      // width: '100%',
      justifyContent: 'center',
      borderRadius: 20,
      padding: 20,
    },
    topBar: {
      // right: 20,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // padding: 20,
      marginBottom: 20,
    },
    topBarTitle: {
      fontSize: 25,
      color: colors.grey[500],
    },
    subProgresses: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 30,
    },
    connectFitbitContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 400,
      // marginTop: 50,
    },
    bottomBar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
  });
};

export default getStyles;