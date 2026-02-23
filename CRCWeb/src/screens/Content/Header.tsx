import { TopNavigation } from "@ui-kitten/components";
import { Text } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";

type ContentHeaderProps = {
  title: string;
  backAction?: React.ReactElement | null;
  forwardAction?: React.ReactElement | null;
};

export default function ContentHeader({ title, backAction, forwardAction }: ContentHeaderProps): React.ReactElement {
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);

  return (
    <TopNavigation
      title={() => <Text style={styles.title}>{title}</Text>}
      alignment="center"
      accessoryLeft={backAction != null ? () => backAction : undefined}
      accessoryRight={forwardAction != null ? () => forwardAction : undefined}
    />
  );
}
