import React from 'react';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useColors } from '@/hooks/useColors';

interface CircularProgressSmallProps {
  progress: number; // 0–1
  size?: number;
}

export function CircularProgressSmall({ progress, size = 40 }: CircularProgressSmallProps): React.ReactElement {
  const colors = useColors();
  const fill = Math.min(100, Math.max(0, progress * 100));
  return (
    <View style={{ marginRight: 10 }}>
      <AnimatedCircularProgress
        size={size}
        width={4}
        fill={fill}
        tintColor={progress >= 1 ? colors.success : colors.primary}
        backgroundColor={colors.primaryLight}
        rotation={0}
      />
    </View>
  );
}
