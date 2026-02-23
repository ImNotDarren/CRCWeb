import React from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { ReactNode } from 'react';

interface AppMenuItemProps {
  title: ReactNode;
  accessoryLeft?: ReactNode;
  accessoryRight?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function AppMenuItem({
  title,
  accessoryLeft,
  accessoryRight,
  onPress,
  style,
  disabled = false,
}: AppMenuItemProps): React.ReactElement {
  const colors = useColors();
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 25,
          paddingHorizontal: 15,
          borderRadius: 12,
          marginVertical: 6,
          marginHorizontal: 20,
          backgroundColor: colors.cardBackground,
          opacity: pressed ? 0.8 : 1,
        },
        style as ViewStyle,
      ]}
    >
      {accessoryLeft != null && <View style={{ marginRight: 10 }}>{accessoryLeft}</View>}
      <View style={{ flex: 1 }}>{typeof title === 'function' ? (title as () => ReactNode)() : title}</View>
      {accessoryRight != null && <View>{accessoryRight}</View>}
    </Pressable>
  );
}
