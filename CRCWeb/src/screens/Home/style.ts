import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

export default function getStyles(fontSize: number, colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1 },
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
    section: {
      marginHorizontal: 20,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    sectionContainer: {
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 15,
      backgroundColor: colors.cardBackground,
    },
    textButton: {
      fontSize: 20 + fontSize,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.text,
    },
  });
}
