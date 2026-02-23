import { StyleSheet } from 'react-native';
import colors from '@/theme/colors';

const getStyles = (fontSize: number) => {
  const base = StyleSheet.create({
    container: { justifyContent: 'center' },
    userinfoContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      margin: 20,
    },
    divider: {
      borderBottomColor: colors.grey[200],
      borderBottomWidth: 1,
      marginBottom: 20,
    },
    username: { fontSize: 22 + fontSize, marginBottom: 5 },
    email: { fontSize: 15 + fontSize, color: colors.grey[300] },
    role: { fontSize: 15 + fontSize, color: colors.grey[300], marginBottom: 2 },
    editButton: { marginHorizontal: 20 },
    menu: { backgroundColor: 'transparent', height: '100%' },
    menuContainer: { display: 'flex', justifyContent: 'flex-start' },
    menuItem: {
      height: 70,
      borderRadius: 12,
      marginVertical: 6,
      justifyContent: 'flex-start',
    },
    MenuItemTitle: { fontSize: 18, marginLeft: 10 },
  });
  return {
    ...base,
    userinfo: (size: number) => ({
      display: 'flex' as const,
      flexDirection: 'column' as const,
      justifyContent: 'center' as const,
      marginLeft: 25,
      height: size,
    }),
  };
};

export default getStyles;
