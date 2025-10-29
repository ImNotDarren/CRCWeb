import { View, Text, ScrollView } from "react-native";
import styles from "./style";
import VimeoVideo from "../../components/VimeoVideo";
import RichText from "../../components/RichText";
import {text} from "./text";


export default function HowToNavigateScreen({ navigation }) {
  return (
    <ScrollView>
      <VimeoVideo vimeoId='870508057' />
      <View style={styles.transcript}>
        <RichText text={text} fontSize={18} />
      </View>
    </ScrollView>
  )
};