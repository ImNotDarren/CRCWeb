import { ScrollView } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import FitbitPanel from "./components/FitbitPanel";

export default function FitbitScreen({ navigation }) {

  const fontSize = useSelector(state => state.font.fontSize);
  const styles = getStyles(fontSize);

  return (
    <ScrollView style={styles.container}>
      <FitbitPanel />
    </ScrollView>
  )
}