import React from 'react';
import { Pressable, ViewStyle, StyleSheet, type StyleProp } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColors } from '@/hooks/useColors';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface IconButtonProps {
  icon: IconName;
  onPress: () => void;
  color?: string;
  size?: number;
  containerSize?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon,
  onPress,
  color,
  size,
  containerSize = 40,
  style,
}: IconButtonProps): React.ReactElement {
  const colors = useColors();
  const iconSize = size ?? containerSize / 2;
  const iconColor = color ?? colors.text;

  const circleStyle: ViewStyle = {
    width: containerSize,
    height: containerSize,
    minWidth: containerSize,
    minHeight: containerSize,
    borderRadius: containerSize / 2,
    overflow: 'hidden',
    alignSelf: 'center',
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [
        styles.container,
        circleStyle,
        { opacity: pressed ? 0.5 : 1 },
        style as ViewStyle,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={iconSize} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
