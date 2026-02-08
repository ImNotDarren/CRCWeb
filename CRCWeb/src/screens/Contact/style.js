import { StyleSheet } from "react-native";
import colors from "../../../theme/colors";

const getStyles = (fontSize) => {
  return StyleSheet.create({
    container: {
      padding: 20,
    },
    title: {
      fontSize: 22 + fontSize,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: colors.grey[500]
    },
  });
};

export default getStyles;