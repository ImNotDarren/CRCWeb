import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Swiper from "./Swiper";
import RichTextView from "../../components/RichText";

const Tab = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);

  return (
    <ScrollView style={styles.container}>
      <View>
        <Swiper />
      </View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate('How To Navigate')}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.textButton}>How To Navigate?</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate('FAQ')}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.textButton}>FAQ</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate('Content')}
      >
        <View style={styles.sectionContainer}>
          <RichTextView
            text='<b>CRCweb</b> is an <b>evidence-based</b> online program made for people with colorectal cancer and their caregivers. It helps both people cope with cancer and symptoms and work together as a team. You can use the app <b>anytime</b>, <b>anywhere</b>, during the <b>8-week</b> study. The program has educational content, behavioral activities, and self-reported surveys.'
            fontSize={20 + fontSize}
          />
        </View>
      </TouchableOpacity>
    </ScrollView>
  )
}