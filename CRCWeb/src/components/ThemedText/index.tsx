import {
  Text,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import type { SemanticColorKey } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: SemanticColorKey;
  type?: 'default' | 'title' | 'subtitle' | 'secondary' | 'link';
};

const typeStyles: Record<NonNullable<ThemedTextProps['type']>, TextStyle> = {
  default: {
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '300',
    lineHeight: 24,
  },
  secondary: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  link: {
    fontSize: 16,
    lineHeight: 22,
  },
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  colorName = 'text',
  type = 'default',
  ...rest
}: ThemedTextProps): React.ReactElement {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    type === 'link' ? 'link' : colorName
  );

  return (
    <Text
      style={[
        { color },
        typeStyles[type],
        style,
      ]}
      {...rest}
    />
  );
}
