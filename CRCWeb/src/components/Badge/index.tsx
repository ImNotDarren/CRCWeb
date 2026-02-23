import { View, ViewStyle } from 'react-native';
import styles from './style';
import type { ReactNode } from 'react';

interface BadgeProps {
  children?: ReactNode;
  style?: ViewStyle;
  show?: boolean;
  [key: string]: unknown;
}

export default function Badge({ children, style, show, ...props }: BadgeProps): React.ReactElement {
  return (
    <>
      {show && <View style={[styles.container, style]} {...props} />}
      {children}
    </>
  );
}
