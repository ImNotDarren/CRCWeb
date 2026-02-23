import React from 'react';
import { ScrollView } from 'react-native';
import styles from './style';
import LocationComponent from '@/src/components/Location';

export default function ActivityScreen(): React.ReactElement {
  return (
    <ScrollView style={styles.container}>
      <LocationComponent />
    </ScrollView>
  );
}
