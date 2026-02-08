import { ScrollView } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import EditLecture from "./EditComponents/EditLecture";
import EditContent from "./EditComponents/EditContent";
import EditResource from "./EditComponents/EditResource";
import EditActivity from "./EditComponents/EditActivity";

export default function EditScreen({ navigation, route }) {
  const { screen, mid } = route.params;

  const screens = {
    "lecture": <EditLecture navigation={navigation} mid={mid} />,
    "content": <EditContent navigation={navigation} mid={mid} />,
    "activities": <EditActivity navigation={navigation} mid={mid} />,
    "resources": <EditResource navigation={navigation} mid={mid} />,
  }

  

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);

  return (
    <ScrollView style={styles.editContainer}>
      {screens[screen]}
    </ScrollView>
  );
};