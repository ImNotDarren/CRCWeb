import React from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { ReactNode } from 'react';

interface AppRadioProps {
  checked: boolean;
  onChange?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AppRadio({ checked, onChange, children, style }: AppRadioProps): React.ReactElement {
  const colors = useColors();
  const ringColor = checked ? colors.primary : colors.border;
  return (
    <Pressable
      onPress={onChange}
      style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }, style]}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: ringColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        {checked && (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.primary,
            }}
          />
        )}
      </View>
      {typeof children === 'function' ? (children as () => ReactNode)() : children}
    </Pressable>
  );
}
