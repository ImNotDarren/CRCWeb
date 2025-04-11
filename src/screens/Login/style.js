import { StyleSheet } from "react-native"
import colors from "../../../theme/colors";

const inputHeight = 50;
const buttonHeight = 50;

const styles = StyleSheet.create({
  outterBox: {
    width: '100%',
    height: '100%',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue[200],
  },
  title: {
    // position: 'absolute',
    // top: 250,
    fontSize: 40,
    marginBottom: 80,
    fontWeight: 'bold',
    color: colors.blue[500],
    // fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontFamily: 'System',
  },
  input: {
    width: '100%',
    height: inputHeight,
    marginBottom: 20,
    backgroundColor: colors.whiteTransparent(0.6),
    borderRadius: inputHeight / 2,
    paddingHorizontal: 20,
  },
  button: {
    height: buttonHeight,
    width: '100%',
    backgroundColor: colors.blue[400],
    padding: 12,
    alignItems: 'center',
    borderRadius: buttonHeight / 2,
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 20,
    justifyContent: 'center',
  },
  checkboxView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginLeft: 20,
  },
  checkboxText: {
    fontSize: 16,
    color: colors.grey[500],
    marginLeft: 10,
  },
});

export default styles;