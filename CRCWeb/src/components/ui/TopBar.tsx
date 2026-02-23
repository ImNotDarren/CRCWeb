import React from 'react';
import { View, Text, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface TopBarProps {
  title: string;
  accessoryLeft?: React.ReactElement | null;
  accessoryRight?: React.ReactElement | null;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

export function TopBar({ title, accessoryLeft, accessoryRight, style, titleStyle }: TopBarProps): React.ReactElement {
  const colors = useColors();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, minHeight: 56, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border }, style]}>
      <View style={{ minWidth: 40 }}>{accessoryLeft ?? null}</View>
      <Text style={[{ fontSize: 18, fontWeight: '600', color: colors.text }, titleStyle]} numberOfLines={1}>
        {title}
      </Text>
      <View style={{ minWidth: 40, alignItems: 'flex-end' }}>{accessoryRight ?? null}</View>
    </View>
  );
}
