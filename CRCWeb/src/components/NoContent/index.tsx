import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { useColors } from '@/hooks/useColors';

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
  const colors = useColors();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize, color: colors.mutedText }}>{content}</Text>
      {action}
    </View>
  );
}
