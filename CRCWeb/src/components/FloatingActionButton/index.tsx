import { StyleSheet, View, TouchableOpacity, type ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface FloatingActionButtonProps {
  icon?: string;
  onPress?: () => void;
  positioning?: boolean;
  color?: string;
  style?: ViewStyle;
  position?: 'left' | 'right';
}

export default function FloatingActionButton({
  icon = 'plus',
  onPress,
  positioning = true,
  color,
  style,
  position = 'right',
}: FloatingActionButtonProps): React.ReactElement {
  const theme = useColorScheme() ?? 'light';
  const backgroundColor = color ?? Colors[theme].floatingActionButton;

  const fabStyle: ViewStyle = {
    ...(positioning
      ? {
          position: 'absolute' as const,
          bottom: 25,
          ...(position === 'right' ? { right: 25 } : { left: 25 }),
        }
      : {}),
    backgroundColor,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  };

  return (
    <View style={[fabStyle, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.touchable}
      >
        <MaterialCommunityIcons name={icon as 'plus'} size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
