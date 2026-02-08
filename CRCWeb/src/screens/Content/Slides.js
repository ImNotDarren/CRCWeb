import { View } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import { Button } from "@ui-kitten/components";
import { openURL } from "../../../utils/url";

export default function SlideScreen({ mid }) {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);

  const url = `https://github.com/hulab-emory/CRCwebAssets/blob/main/slides/${mid}.pdf?`;

  return (
      <View style={styles.slideView}>
        <Button
          appearance="outline"
          status="info"
          onPress={() => openURL(url)}
          style={styles.slideButton}
        >
          View PDF
        </Button>
      </View>
  );
}