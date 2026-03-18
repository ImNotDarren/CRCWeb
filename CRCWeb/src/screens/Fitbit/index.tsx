import React from 'react';
import { useSelector } from 'react-redux';
import getStyles from './style';
import FitbitPanel from './components/FitbitPanel';
import type { RootState } from '@/src/types/store';
import { useColors } from '@/hooks/useColors';
import { ThemedScrollView } from '@/src/components/ThemedScrollView';

export default function FitbitScreen(): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);
  return (
    <ThemedScrollView style={styles.container}>
      <FitbitPanel />
    </ThemedScrollView>
  );
}
