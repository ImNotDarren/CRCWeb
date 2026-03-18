import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface AppSpinnerProps {
  size?: 'small' | 'large';
}

export function AppSpinner({ size = 'small' }: AppSpinnerProps): React.ReactElement {
  const colors = useColors();
  return (
    <ActivityIndicator size={size} color={colors.primary} />
  );
}
