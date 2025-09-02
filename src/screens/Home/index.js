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
            text='<b>CRCWeb</b> is an <b>evidence-based</b> online program designed for individuals with colorectal cancer. It helps patients cope with cancer and its symptoms while supporting <b>mental health</b> during treatment. The app can be used <b>anytime and anywhere</b> over the <b>3-month</b> study period. The program includes educational content, behavioral activities, timely recommendations, and self-report surveys.'
            fontSize={20 + fontSize}
          />
        </View>
      </TouchableOpacity>
    </ScrollView>
  )
}