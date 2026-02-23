import React from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { ReactNode } from 'react';

type Appearance = 'filled' | 'outline';
type Status = 'primary' | 'danger' | 'basic' | 'info' | 'warning';

interface AppButtonProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  appearance?: Appearance;
  status?: Status;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessoryLeft?: () => ReactNode;
}

export function AppButton({
  children,
  onPress,
  disabled = false,
  appearance = 'filled',
  status = 'primary',
  style,
  textStyle,
  accessoryLeft,
}: AppButtonProps): React.ReactElement {
  const colors = useColors();
  const isPrimary = status === 'primary';
  const isDanger = status === 'danger';
  const isWarning = status === 'warning';
  const isInfo = status === 'info';
  const accentColor = isDanger ? colors.error : isWarning ? '#f59e0b' : isInfo ? colors.primary : colors.primary;
  const bg = appearance === 'filled'
    ? (isDanger ? colors.error : accentColor)
    : 'transparent';
  const borderColor = accentColor;
  const borderWidth = appearance === 'outline' ? 2 : 0;
  const color = appearance === 'filled' ? colors.onPrimary : accentColor;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 25,
          backgroundColor: bg,
          borderWidth,
          borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style as ViewStyle,
      ]}
    >
      {accessoryLeft && (
        <View style={{ marginRight: 8 }}>
          {accessoryLeft()}
        </View>
      )}
      <Text style={[{ color, fontSize: 16, fontWeight: '600' }, textStyle]}>
        {children}
      </Text>
    </Pressable>
  );
}
