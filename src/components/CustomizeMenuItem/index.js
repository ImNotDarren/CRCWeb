import { Alert, Text, View } from "react-native";
import { CircularProgressBar, MenuItem } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Expand from "../Expand";
import colors from "../../../theme/colors";
import { useSelector } from "react-redux";
import getStyles from "./style";


export const CustomizeMenuItem = ({ title, subtitle, icon, progress, onNavigate, drag, active, accessoryRight }) => {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);

  const handlePress = () => {
    if (onNavigate) {
      return onNavigate();
    }
  }

  return (
    // <Animated.View style={{ transform: [{ scale: scaleValue }], paddingHorizontal: 20 }}>
    <MenuItem
      title={() =>
        <View style={styles.titleView}>
          <Text style={!onNavigate && !accessoryRight ? { ...styles.MenuItemTitle, color: colors.grey[300] } : styles.MenuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.MenuItemSubtitle}>{subtitle}</Text>}
        </View>
      }
      accessoryLeft={() =>
        icon && (
          <MaterialCommunityIcons
            name={icon}
            size={18 + fontSize}
            color={!onNavigate && !accessoryRight ? colors.grey[300] : null}
            style={{ marginRight: 10 }}
          />
        )
      }
      accessoryRight={() => (
        <>
          <Expand />

          {
            progress &&
            <CircularProgressBar
              progress={progress}
              size="small"
              style={styles.progressBar}
              status={progress === 1 ? 'success' : 'info'}
            />
          }
          {
            !progress && accessoryRight ?
              accessoryRight :
              <MaterialCommunityIcons name='chevron-right' size={22 + fontSize} color={!onNavigate ? colors.grey[300] : null} />
          }

        </>
      )}
      style={styles.menuItem}
      onPress={handlePress}
      onLongPress={drag}
    />
    // </Animated.View>
  );
}
