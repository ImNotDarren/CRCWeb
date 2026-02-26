import React from 'react';
import { TouchableOpacity, ViewStyle, StyleSheet, type StyleProp } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColors } from '@/hooks/useColors';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface RoundButtonProps {
  icon: IconName;
  onPress: () => void;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function RoundButton({
  icon,
  onPress,
  color,
  size = 40,
  style,
}: RoundButtonProps): React.ReactElement {
  const colors = useColors();
  const iconSize = size / 2;
  const iconColor = color ?? colors.text;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.inputBackground,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
