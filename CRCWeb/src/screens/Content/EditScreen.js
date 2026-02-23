import { ScrollView } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import EditLecture from "./EditComponents/EditLecture";
import EditContent from "./EditComponents/EditContent";
import EditResource from "./EditComponents/EditResource";
import EditActivity from "./EditComponents/EditActivity";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditScreen() {
  const { screen, mid } = useLocalSearchParams();
  const router = useRouter();

  const screens = {
    "lecture": <EditLecture router={router} mid={mid} />,
    "content": <EditContent router={router} mid={mid} />,
    "activities": <EditActivity router={router} mid={mid} />,
    "resources": <EditResource router={router} mid={mid} />,
  }

  

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);

  return (
    <ScrollView style={styles.editContainer}>
      {screens[screen]}
    </ScrollView>
  );
};