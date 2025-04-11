import { Image, View } from "react-native";
import getStyles from "./style";
import { ViewPager } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const interval = 8000;

export default function Swiper() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);

  useEffect(() => {
    const pageCount = 3;
    const changePage = () => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % pageCount);
    };
    const intervalId = setInterval(changePage, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return (
    <ViewPager
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}
      level="2"
      swipeEnabled={false}
    >
      <View style={styles.swiperView}>
        <Image
          source={require('../../../assets/swiper_pics/Homepage1.jpg')}
          resizeMode='cover'
          style={styles.swiperImage}
        />
      </View>
      <View style={styles.swiperView}>
        <Image
          source={require('../../../assets/swiper_pics/Homepage2.jpg')}
          resizeMode='cover'
          style={styles.swiperImage}
        />
      </View>
      <View style={styles.swiperView}>
        <Image
          source={require('../../../assets/swiper_pics/Homepage3.jpg')}
          resizeMode='cover'
          style={styles.swiperImage}
        />
      </View>
    </ViewPager>
  )
}