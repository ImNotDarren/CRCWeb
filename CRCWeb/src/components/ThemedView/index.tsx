import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import type { SemanticColorKey } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: SemanticColorKey;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  colorName = 'background',
  ...otherProps
}: ThemedViewProps): React.ReactElement {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorName
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
