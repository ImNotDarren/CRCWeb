import { Dimensions, StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

export default function getStyles(fontSize: number, colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    lectureCard: {
      backgroundColor: colors.cardBackground,
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
      color: colors.error,
      fontSize: 16 + fontSize,
      paddingHorizontal: 5,
    },
    resourcesTitle: {
      fontSize: 18 + fontSize,
      fontWeight: 'bold',
      margin: 20,
    },
  });
}
