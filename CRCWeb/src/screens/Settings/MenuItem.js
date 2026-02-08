import { Alert, Text } from "react-native";
import { MenuItem } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from "./style";
import Expand from "../../components/Expand";
import colors from "../../../theme/colors";
import { alert } from "../../../utils/alert";

export const MenuItem = ({ title, icon, onNavigate }) => {

  const handlePress = () => {
    if (onNavigate) {
      return onNavigate();
    }
    alert('Work in progress...');
  }

  return (
    <MenuItem
      title={() => <Text style={!onNavigate ? {...styles.MenuItemTitle, color: colors.grey[300] } : styles.MenuItemTitle}>{title}</Text>}
      accessoryLeft={() => <MaterialCommunityIcons name={icon} size={18} color={!onNavigate ? colors.grey[300] : null} />}
      accessoryRight={() => (
        <>
          <Expand />
          <MaterialCommunityIcons name='chevron-right' size={22} color={!onNavigate ? colors.grey[300] : null}  />
        </>
      )}
      style={styles.menuItem}
      onPress={handlePress}
    />
  );
}