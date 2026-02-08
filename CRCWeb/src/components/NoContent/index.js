import { Text, View } from "react-native";
import colors from "../../../theme/colors";

export default function NoContent({ fontSize = 20, content = "No Content Available", action }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: fontSize, color: colors.grey[300] }}>
        No Content Available
      </Text>
      {action && action}
    </View>
  );
}