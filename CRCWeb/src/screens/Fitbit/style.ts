import { StyleSheet } from 'react-native';
import colors from '@/theme/colors';

const getStyles = (fontSize: number) =>
  StyleSheet.create({
    container: { padding: 20 },
    fitbitPanelContainer: {
      backgroundColor: colors.white,
      justifyContent: 'center',
      borderRadius: 20,
      padding: 20,
    },
    mainProgress: {},
    topBar: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    topBarTitle: { fontSize: 25, color: colors.grey[500] },
    iconStyle: {},
    subProgresses: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 30,
    },
    connectFitbitContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 400,
    },
    bottomBar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
  });

export default getStyles;
