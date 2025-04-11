import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import colors from "../../../theme/colors";

export default function FloatingActionButton({ icon, onPress, positioning = true, color = colors.blue[400] }) {
  const styles = StyleSheet.create({
    fab: {
      ...(positioning ? {
        position: 'absolute',
        bottom: 25,
        right: 25
      } : {}),
      backgroundColor: color,
      borderRadius: 50,
      padding: 8,
      zIndex: 999,
    },
  });

  return (
    <View style={styles.fab}>
      <IconButton
        icon={icon || "plus"}
        size={24}
        iconColor="white"
        onPress={onPress}
      />
    </View>
  );
}