import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

export default function getVersionSelectionStyles(colors: ThemeColors) {
  return StyleSheet.create({
    grid: {
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
      padding: 40,
      paddingVertical: '20%',
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cell: {
      width: '100%',
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      marginBottom: 40,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 20,
      flexDirection: 'column',
      padding: 20,
    },
    cellTitle: {
      fontSize: 35,
      color: colors.text,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    cellText: {
      fontSize: 18,
      color: colors.secondaryText,
      textAlign: 'center',
      marginTop: 20,
    },
    addCell: {
      width: '100%',
      marginBottom: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      flexDirection: 'column',
      padding: 20,
      borderColor: colors.border,
      borderWidth: 2,
      borderStyle: 'dashed',
    },
  });
}
