import { TopNavigation } from "@ui-kitten/components";
import { Text } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";

export default function ContentHeader({ title, backAction, forwardAction }) {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);

  return (
    <TopNavigation
      title={() => <Text style={styles.title}>{title}</Text>}
      alignment="center"
      accessoryLeft={backAction}
      accessoryRight={forwardAction}
    />
  );
}