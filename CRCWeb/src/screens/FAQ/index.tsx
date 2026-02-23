import React from 'react';
import { View, ScrollView } from 'react-native';
import styles from './style';
import RichText from '@/src/components/RichText';
import { text } from './text';

export default function FAQScreen(): React.ReactElement {
  return (
    <ScrollView style={styles.container}>
      <RichText text={text} fontSize={18} />
      <View style={styles.bottomWhiteSpace} />
    </ScrollView>
  );
}
