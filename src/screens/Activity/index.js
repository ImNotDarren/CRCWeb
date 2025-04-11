import { View, Text, ScrollView } from "react-native";
import styles from "./style";
import LocationComponent from "../../components/Location";

export default function ActivityScreen() {
  return (
    <ScrollView style={styles.container}>
      <LocationComponent />
    </ScrollView>
  );
}