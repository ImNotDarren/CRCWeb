import { StyleSheet } from 'react-native';
import colors from '@/theme/colors';

const getStyles = (fontSize: number) =>
  StyleSheet.create({
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
