import { View, Text, ScrollView } from "react-native";
import styles from "./style";
import RichText from "../../components/RichText";
import { text } from "./text";

export default function FAQScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <RichText text={text} fontSize={18} />
      <View style={styles.bottomWhiteSpace} />
    </ScrollView>
  )
}