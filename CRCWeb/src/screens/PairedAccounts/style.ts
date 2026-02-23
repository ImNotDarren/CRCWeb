import { Dimensions, StyleSheet } from 'react-native';
import colors from '@/theme/colors';

const getStyles = () => {
  const base = StyleSheet.create({
    container: { paddingVertical: 20, flex: 1 },
    input: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 20,
    },
    inputText: { height: 35, fontSize: 20 },
    pairContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: 20,
      marginHorizontal: 20,
      borderRadius: 15,
      backgroundColor: colors.white,
    },
    pairText: { fontSize: 25, color: colors.grey[400] },
    username: { fontSize: 22, marginBottom: 5 },
    email: { fontSize: 15, color: colors.grey[300] },
    role: { fontSize: 15, color: colors.grey[300], marginBottom: 2 },
    unpairContainer: { justifyContent: 'center', alignItems: 'center', marginLeft: 20 },
    pendingText: { color: colors.grey[200], fontSize: 18 },
    buttonView: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
    emptyView: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 20,
      marginHorizontal: 20,
      borderBottomColor: colors.grey[100],
      borderBottomWidth: 1,
    },
    emptyText: { fontSize: 20, color: colors.grey[400] },
  });
  return {
    ...base,
    userinfo: (size: number) =>
      ({
        display: 'flex' as const,
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        marginLeft: 25,
        height: size,
      }),
  };
};

export default getStyles();
