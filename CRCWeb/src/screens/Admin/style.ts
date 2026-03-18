import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

export default function getStyles(fontSize: number, colors: ThemeColors) {
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
      color: colors.mutedText,
    },
    addUserContainer: {
      padding: 20,
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
      marginLeft: 3,
      color: colors.secondaryText,
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
}
