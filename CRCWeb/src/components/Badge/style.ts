import { StyleSheet } from 'react-native';
import colors from '@/theme/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.red[400],
    position: 'absolute',
    top: 0,
    right: 5,
    height: 10,
    width: 10,
    borderRadius: 5,
  },
});

export default styles;
