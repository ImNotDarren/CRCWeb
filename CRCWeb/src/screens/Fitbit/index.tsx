import React from 'react';
import { ScrollView } from 'react-native';
import getStyles from './style';
import { useSelector } from 'react-redux';
import FitbitPanel from './components/FitbitPanel';
import type { RootState } from '@/src/types/store';

export default function FitbitScreen(): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);
  return (
    <ScrollView style={styles.container}>
      <FitbitPanel />
    </ScrollView>
  );
}
