import React from 'react';
import {
  Text,
  TextInput,
  View,
  type StyleProp, type ViewStyle, type TextInputProps,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { ReactNode } from 'react';

interface AppInputProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  textStyle?: TextInputProps['style'];
  label?: string;
  accessoryRight?: () => ReactNode;
}

export function AppInput({
  style,
  textStyle,
  label,
  accessoryRight,
  placeholderTextColor,
  ...rest
}: AppInputProps): React.ReactElement {
  const colors = useColors();
  return (
    <View style={[{ flexDirection: 'column' }, style]}>
      {label != null && label !== '' && (
        <Text style={{ fontSize: 14, color: colors.secondaryText, marginBottom: 6 }}>{label}</Text>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TextInput
        placeholderTextColor={placeholderTextColor ?? colors.inputPlaceholder}
        style={[
          {
            flex: 1,
            height: 50,
            backgroundColor: colors.inputBackground,
            borderRadius: 25,
            paddingHorizontal: 20,
            fontSize: 16,
            color: colors.text,
          },
          textStyle as ViewStyle,
        ]}
        {...rest}
      />
      {accessoryRight && (
        <View style={{ position: 'absolute', right: 12 }}>
          {accessoryRight()}
        </View>
      )}
      </View>
    </View>
  );
}
