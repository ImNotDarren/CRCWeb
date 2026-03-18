import React, { useEffect, useState, useRef } from 'react';
import { Image, View, FlatList, useWindowDimensions } from 'react-native';
import getStyles from './style';
import { useSelector } from 'react-redux';
import type { RootState } from '@/src/types/store';
import { useColors } from '@/hooks/useColors';

const interval = 8000;
const PAGES = [
  require('@/assets/swiper_pics/Homepage1.jpg'),
  require('@/assets/swiper_pics/Homepage2.jpg'),
  require('@/assets/swiper_pics/Homepage3.jpg'),
];

export default function Swiper(): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);

  useEffect(() => {
    const changePage = () => {
      setSelectedIndex((prev) => {
        const next = (prev + 1) % PAGES.length;
        flatListRef.current?.scrollToOffset({ offset: next * width, animated: true });
        return next;
      });
    };
    const id = setInterval(changePage, interval);
    return () => clearInterval(id);
  }, [width]);

  return (
    <FlatList
      ref={flatListRef}
      data={PAGES}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={(e) => {
        const i = Math.round(e.nativeEvent.contentOffset.x / width);
        setSelectedIndex(i);
      }}
      renderItem={({ item }) => (
        <View style={[styles.swiperView, { width }]}>
          <Image source={item} resizeMode="cover" style={styles.swiperImage} />
        </View>
      )}
      keyExtractor={(_, i) => String(i)}
    />
  );
}
