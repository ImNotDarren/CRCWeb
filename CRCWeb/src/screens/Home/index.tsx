import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import getStyles from './style';
import { useSelector } from 'react-redux';
import Swiper from './Swiper';
import RichTextView from '@/src/components/RichText';
import { useRouter } from 'expo-router';
import type { RootState } from '@/src/types/store';
import { useColors } from '@/hooks/useColors';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen(): React.ReactElement {
  const router = useRouter();
  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);

  return (
    <ScrollView style={styles.container}>
      <View>
        <Swiper />
      </View>
      <View style={styles.section}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={[styles.sectionContainer, { marginLeft: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }]}
          onPress={() => router.push('/how-to-navigate')}
        >
          <Text style={styles.textButton}>How To Navigate?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          style={[styles.sectionContainer, { marginHorizontal: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }]}
          onPress={() => router.push('/faq')}
        >
          <Text style={styles.textButton}>FAQ</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.sectionContainer}
        onPress={() => router.push('/(tabs)/content')}
      >
        <RichTextView
          text="<b>CRCWeb</b> is an <b>evidence-based</b> online program designed for individuals with colorectal cancer. It helps patients cope with cancer and its symptoms while supporting <b>mental health</b> during treatment. The app can be used <b>anytime and anywhere</b> over the <b>3-month</b> study period. The program includes educational content, behavioral activities, timely recommendations, and self-report surveys."
          fontSize={20 + fontSize}
        />
      </TouchableOpacity>
    </ScrollView>
  );
}
