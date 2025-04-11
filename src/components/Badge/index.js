import { View } from "react-native";
import styles from "./style";

export default function Badge({ children, style, show, ...props }) {
  return (
    <>
      {show && <View style={[styles.container, style]} {...props}></View>}
      {children}
    </>
  );
}