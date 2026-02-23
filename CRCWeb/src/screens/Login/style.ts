import { StyleSheet } from 'react-native';
import colors from '@/theme/colors';

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
    fontSize: 40,
    marginBottom: 80,
    fontWeight: 'bold',
    color: colors.blue[500],
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
  privacyLinkContainer: {
    marginTop: 30,
    padding: 10,
  },
  privacyLinkText: {
    color: colors.blue[500],
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  grid: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: 40,
    paddingVertical: '20%',
    backgroundColor: colors.blue[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: '100%',
    backgroundColor: colors.blue[400],
    marginBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'column',
    padding: 20,
  },
  cellTitle: {
    fontSize: 35,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 18,
    color: colors.blue[100],
    textAlign: 'center',
    marginTop: 20,
  },
  addCell: {
    width: '100%',
    marginBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'column',
    padding: 20,
    borderColor: colors.blue[400],
    borderWidth: 2,
  },
});

export default styles;
