import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../../../theme/colors";
import { alert } from "../../../utils/alert";

export default function DiscussionScreen({ navigation }) {

  const fontSize = useSelector(state => state.font.fontSize);
  const styles = getStyles(fontSize);

  const apps = [
    {
      name: "Facebook",
      icon: "facebook",
      color: colors.blue[400],
      appScheme: "fb://"
    },
    {
      name: "WhatsApp",
      icon: "whatsapp",
      color: colors.green[400],
      appScheme: "whatsapp://"
    },
    {
      name: "Messages",
      icon: "message",
      color: colors.green[500],
      appScheme: "sms://"
    }
  ];

  const handleRedirect = (app) => () => {
    Linking.canOpenURL(app.appScheme).then(supported => {
      if (supported) {
        Linking.openURL(app.appScheme);
      } else {
        alert('Error', 'This app is not installed on your device');
      }
    });
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Please select an app for communication</Text>
      <View style={styles.buttonContainer}>
        {apps.map((app, index) => (
          <TouchableOpacity key={index} activeOpacity={0.5} onPress={handleRedirect(app)}>
            <MaterialCommunityIcons name={app.icon} size={50} color={app.color} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}