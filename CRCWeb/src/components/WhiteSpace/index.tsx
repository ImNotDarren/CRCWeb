import { View } from 'react-native';
import type { ReactNode } from 'react';

interface WhiteSpaceProps {
  height?: number;
}

export default function WhiteSpace({ height = 70 }: WhiteSpaceProps): React.ReactElement {
  return <View style={{ height }} />;
}
