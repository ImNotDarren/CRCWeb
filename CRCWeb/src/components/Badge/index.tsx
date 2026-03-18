import { View, ViewStyle } from 'react-native';
import { getBadgeStyles } from './style';
import type { ReactNode } from 'react';
import { useColors } from '@/hooks/useColors';

interface BadgeProps {
  children?: ReactNode;
  style?: ViewStyle;
  show?: boolean;
  [key: string]: unknown;
}

export default function Badge({ children, style, show, ...props }: BadgeProps): React.ReactElement {
  const colors = useColors();
  const styles = getBadgeStyles(colors);
  return (
    <>
      {show && <View style={[styles.container, style]} {...props} />}
      {children}
    </>
  );
}
