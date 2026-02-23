import { Text, View } from 'react-native';
import colors from '@/theme/colors';
import type { ReactNode } from 'react';

interface NoContentProps {
  fontSize?: number;
  content?: string;
  action?: ReactNode;
}

export default function NoContent({
  fontSize = 20,
  content = 'No Content Available',
  action,
}: NoContentProps): React.ReactElement {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize, color: colors.grey[300] }}>{content}</Text>
      {action}
    </View>
  );
}
