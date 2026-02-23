import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

const inputHeight = 50;
const buttonHeight = 50;

export default function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    outterBox: {
      width: '100%',
      height: '100%',
      padding: 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primaryLight,
    },
    title: {
      fontSize: 40,
      marginBottom: 80,
      fontWeight: 'bold',
      color: colors.primaryDark,
      fontFamily: 'System',
    },
    input: {
      width: '100%',
      height: inputHeight,
      marginBottom: 20,
      backgroundColor: colors.inputOverlay,
      borderRadius: inputHeight / 2,
      paddingHorizontal: 20,
    },
    button: {
      height: buttonHeight,
      width: '100%',
      backgroundColor: colors.primary,
      padding: 12,
      alignItems: 'center',
      borderRadius: buttonHeight / 2,
      marginTop: 20,
    },
    buttonText: {
      color: colors.onPrimary,
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
      color: colors.text,
      marginLeft: 10,
    },
    privacyLinkContainer: {
      marginTop: 30,
      padding: 10,
    },
    privacyLinkText: {
      color: colors.link,
      textDecorationLine: 'underline',
      fontSize: 14,
    },
    grid: {
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
      padding: 40,
      paddingVertical: '20%',
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cell: {
      width: '100%',
      backgroundColor: colors.primary,
      marginBottom: 40,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 20,
      flexDirection: 'column',
      padding: 20,
    },
    cellTitle: {
      fontSize: 35,
      color: colors.onPrimary,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    cellText: {
      fontSize: 18,
      color: colors.primaryLight,
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
      borderColor: colors.primary,
      borderWidth: 2,
    },
  });
}
