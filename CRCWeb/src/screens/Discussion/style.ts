import { StyleSheet } from 'react-native';

const getStyles = (fontSize: number) =>
  StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 24 + fontSize, marginBottom: 20 },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
      paddingHorizontal: 20,
    },
  });

export default getStyles;
