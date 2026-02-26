import { ScrollView, type ScrollViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import type { SemanticColorKey } from '@/constants/Colors';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: SemanticColorKey;
};

const DEFAULT_CONTENT_BOTTOM_PADDING = 100;

export function ThemedScrollView({
  style,
  contentContainerStyle,
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
      contentContainerStyle={[
        { paddingBottom: DEFAULT_CONTENT_BOTTOM_PADDING },
        contentContainerStyle,
      ]}
      {...otherProps}
    />
  );
}
