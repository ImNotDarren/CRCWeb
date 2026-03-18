import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/Colors';

export default function getStyles(colors: ThemeColors) {
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
      backgroundColor: colors.cardBackground,
    },
    pairText: { fontSize: 25, color: colors.secondaryText },
    username: { fontSize: 22, marginBottom: 5, color: colors.text },
    email: { fontSize: 15, color: colors.mutedText },
    role: { fontSize: 15, color: colors.mutedText, marginBottom: 2 },
    unpairContainer: { justifyContent: 'center', alignItems: 'center', marginLeft: 20 },
    pendingText: { color: colors.border, fontSize: 18 },
    buttonView: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
    emptyView: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 20,
      marginHorizontal: 20,
      borderBottomColor: colors.borderLight,
      borderBottomWidth: 1,
    },
    emptyText: { fontSize: 20, color: colors.secondaryText },
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
}
