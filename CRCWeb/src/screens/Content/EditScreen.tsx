import { ScrollView, Text, View } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import EditLecture from "./EditComponents/EditLecture";
import EditContent from "./EditComponents/EditContent";
import EditResource from "./EditComponents/EditResource";
import EditActivity from "./EditComponents/EditActivity";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";

function paramString(p: string | string[] | undefined): string {
  if (p == null) return "";
  return Array.isArray(p) ? p[0] ?? "" : p;
}

const EDIT_SCREEN_KEYS = ["lecture", "content", "activities", "resources"] as const;

export type EditScreenProps = {
  screen?: string;
  mid?: string;
  router?: ReturnType<typeof useRouter>;
};

export default function EditScreen(props?: EditScreenProps): React.ReactElement {
  const params = useLocalSearchParams<{ type?: string | string[]; mid?: string | string[] }>();
  const routerFromHook = useRouter();
  const router = props?.router ?? routerFromHook;
  const screen = props?.screen ?? paramString(params.type);
  const mid = props?.mid ?? paramString(params.mid);

  const screens: Record<string, React.ReactElement> = {
    lecture: <EditLecture router={router} mid={mid} />,
    content: <EditContent router={router} mid={mid} />,
    activities: <EditActivity router={router} mid={mid} />,
    activity: <EditActivity router={router} mid={mid} />,
    resources: <EditResource router={router} mid={mid} />,
  };

  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);

  const content = screen ? screens[screen] : null;

  if (!screen || !mid) {
    return (
      <View style={[styles.editContainer, { justifyContent: "center", padding: 24 }]}>
        <Text style={{ fontSize: 16, color: colors.mutedText, textAlign: "center" }}>
          Missing module or edit type. Go back and open Edit from a content module.
        </Text>
      </View>
    );
  }

  if (!content) {
    return (
      <View style={[styles.editContainer, { justifyContent: "center", padding: 24 }]}>
        <Text style={{ fontSize: 16, color: colors.mutedText, textAlign: "center" }}>
          Unknown edit type "{screen}". Use one of: {EDIT_SCREEN_KEYS.join(", ")}.
        </Text>
      </View>
    );
  }

  return <ScrollView style={styles.editContainer} contentContainerStyle={{ paddingBottom: 100 }}>{content}</ScrollView>;
}
