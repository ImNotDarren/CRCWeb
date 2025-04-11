import { StyleSheet } from "react-native"
import colors from "../../../theme/colors";

const getStyles = (fontSize) => StyleSheet.create({
  swiperView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  swiperImage: {
    height: 260,
    width: '90%',
    borderRadius: 15,
  },
  sectionContainer: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  textButton: {
    fontSize: 20 + fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.grey[500],
  },
});

export default getStyles;