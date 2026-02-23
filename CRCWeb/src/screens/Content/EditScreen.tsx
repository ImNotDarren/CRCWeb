import { ScrollView } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import EditLecture from "./EditComponents/EditLecture";
import EditContent from "./EditComponents/EditContent";
import EditResource from "./EditComponents/EditResource";
import EditActivity from "./EditComponents/EditActivity";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditScreen(): React.ReactElement {
  const { screen, mid } = useLocalSearchParams<{ screen: string; mid: string }>();
  const router = useRouter();

  const screens: Record<string, React.ReactElement> = {
    "lecture": <EditLecture router={router} mid={mid} />,
    "content": <EditContent router={router} mid={mid} />,
    "activities": <EditActivity router={router} mid={mid} />,
    "resources": <EditResource router={router} mid={mid} />,
  };

  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);

  return (
    <ScrollView style={styles.editContainer}>
      {screen ? screens[screen] : null}
    </ScrollView>
  );
}
