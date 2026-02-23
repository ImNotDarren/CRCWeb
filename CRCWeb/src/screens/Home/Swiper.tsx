import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import getStyles from './style';
import { ViewPager } from '@ui-kitten/components';
import { useSelector } from 'react-redux';
import type { RootState } from '@/src/types/store';

const interval = 8000;

export default function Swiper(): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);

  useEffect(() => {
    const pageCount = 3;
    const changePage = () => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % pageCount);
    };
    const intervalId = setInterval(changePage, interval);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ViewPager
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index)}
      swipeEnabled={false}
    >
      <View style={styles.swiperView}>
        <Image
          source={require('@/assets/swiper_pics/Homepage1.jpg')}
          resizeMode="cover"
          style={styles.swiperImage}
        />
      </View>
      <View style={styles.swiperView}>
        <Image
          source={require('@/assets/swiper_pics/Homepage2.jpg')}
          resizeMode="cover"
          style={styles.swiperImage}
        />
      </View>
      <View style={styles.swiperView}>
        <Image
          source={require('@/assets/swiper_pics/Homepage3.jpg')}
          resizeMode="cover"
          style={styles.swiperImage}
        />
      </View>
    </ViewPager>
  );
}
