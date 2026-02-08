import { useDispatch, useSelector } from "react-redux";
import getStyles from "./style";
import { View, Text } from "react-native";
import { Button, ButtonGroup, Menu, MenuItem, Toggle } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Expand from "../../components/Expand";
import fontSizes from "../../../theme/fontSizes";
import { get, save } from "../../../localStorage";
import { CustomizeMenuItem } from "../../components/CustomizeMenuItem";
import { useEffect, useState } from "react";

export default function SettingsScreen({ navigation }) {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  // const [showFitbit, setShowFitbit] = useState(false);

  // useEffect(() => {
  //   get(`showFitbit-${user.user.id}`)
  //     .then(async (value) => {
  //       if (value === null || value === undefined) {
  //         await save(`showFitbit-${user.user.id}`, true);
  //         setShowFitbit(true);
  //       } else {
  //         setShowFitbit(JSON.parse(value));
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // }, []);

  const handleFont = (fs) => () => {
    dispatch({ type: 'UPDATE_FONTSIZE', value: fs });
    save('fontSize', fs);
  }

  // const handleFitbitChange = () => {
  //   save(`showFitbit-${user.user.id}`, !showFitbit);
  //   setShowFitbit(curr => !curr);
  // }

  return (
    <View>
      <Menu style={styles.menu}>
        <CustomizeMenuItem
          title="Font size"
          icon="format-size"
          accessoryRight={
            <View>
              <ButtonGroup appearance="outline">
                <Button disabled={fontSize === fontSizes.small} onPress={handleFont('small')}>S</Button>
                <Button disabled={fontSize === fontSizes.medium} onPress={handleFont('medium')}>M</Button>
                <Button disabled={fontSize === fontSizes.large} onPress={handleFont('large')}>L</Button>
              </ButtonGroup>
            </View>
          }
        />
        {/* <CustomizeMenuItem
          title="Show Fitbit tab"
          icon="fire-circle"
          accessoryRight={
            <Toggle
              checked={showFitbit}
              onChange={handleFitbitChange}
            />
          }
        /> */}
      </Menu>
    </View>
  );

}
