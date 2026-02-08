import { Dimensions, StyleSheet } from "react-native";
import colors from "../../../../theme/colors";

const getStyles = (fontSize) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    lectureCard: {
      backgroundColor: colors.white,
      marginVertical: 10,
      padding: 20,
      borderRadius: 10,
    },
    lectureCardTitle: {
      fontSize: 18 + fontSize,
    },
    popupContainer: {
      width: (Dimensions.get('window').width - 40) * 0.8,
    },
    popupInput: {
      marginVertical: 10,
    },
    popupText: {
      lineHeight: 25,
      maxHeight: 140,
      fontSize: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      flex: 1,
    },
    error: {
      color: colors.red[400],
      fontSize: 16 + fontSize,
      paddingHorizontal: 5
    },
    resourcesTitle: {
      fontSize: 18 + fontSize,
      fontWeight: 'bold',
      margin: 20,
    },
  });
};

export default getStyles;