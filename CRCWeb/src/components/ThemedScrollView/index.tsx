import { ScrollView, type ScrollViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import type { SemanticColorKey } from '@/constants/Colors';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: SemanticColorKey;
};

export function ThemedScrollView({
  style,
  lightColor,
  darkColor,
  colorName = 'background',
  ...otherProps
}: ThemedScrollViewProps): React.ReactElement {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorName
  );

  return (
    <ScrollView
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
