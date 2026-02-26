import React from 'react';
import { View, ScrollView } from 'react-native';
import styles from './style';
import VimeoVideo from '@/src/components/VimeoVideo';
import RichText from '@/src/components/RichText';
import { text } from './text';

export default function HowToNavigateScreen(): React.ReactElement {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      <VimeoVideo vimeoId="1130343124" />
      <View style={styles.transcript}>
        <RichText text={text} fontSize={18} />
      </View>
    </ScrollView>
  );
}
