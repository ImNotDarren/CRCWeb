import { Alert, Text } from "react-native";
import { MenuItem } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Expand from "../../components/Expand";
import colors from "../../../theme/colors";
import { useSelector } from "react-redux";
import getStyles from "./style";
import { alert } from "../../../utils/alert";

export const UserMenuItem = ({ title, icon, onNavigate }) => {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);

  const handlePress = () => {
    if (onNavigate) {
      return onNavigate();
    }
    alert('Work in progress...');
  }
  

  return (
    <MenuItem
      title={() => <Text style={!onNavigate ? {...styles.MenuItemTitle, color: colors.grey[300] } : styles.MenuItemTitle}>{title}</Text>}
      accessoryLeft={() => <MaterialCommunityIcons name={icon} size={18 + fontSize} color={!onNavigate ? colors.grey[300] : null} />}
      accessoryRight={() => (
        <>
          <Expand />
          <MaterialCommunityIcons name='chevron-right' size={22 + fontSize} color={!onNavigate ? colors.grey[300] : null}  />
        </>
      )}
      style={styles.menuItem}
      onPress={handlePress}
    />
  );
}