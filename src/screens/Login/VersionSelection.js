import { Text, View } from "react-native";
import styles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { isAdmin } from "../../../utils/user";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../../../theme/colors";
import { TouchableOpacity } from "react-native";
import { useEffect } from "react";

export default function VersionSelection({ navigation }) {

  const versions = useSelector((state) => state.version.versions);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const handleSelect = (version) => {
    dispatch({ type: 'UPDATE_CURRENT_VERSION', value: version });
    navigation.replace('TabNavigation', { screen: 'Home' });
  };

  useEffect(() => {
    dispatch({ type: 'CLEAR_MODULES' });
  }, [dispatch]);

  return (
    <View style={styles.grid}>
        {
          versions.map((v) => (
            <TouchableOpacity activeOpacity={0.8} key={v.id} style={styles.cell} onPress={() => handleSelect(v)}>
              <Text style={styles.cellTitle}>
                {v.name}
              </Text>
              <Text style={styles.cellText}>
                {v.description}
              </Text>
            </TouchableOpacity>
          ))
        }
        {
          isAdmin(user?.featureUsers?.[4]?.role) && (
            <TouchableOpacity activeOpacity={0.8} style={styles.addCell}>
              <MaterialCommunityIcons name="plus" color={colors.blue[400]} size={40} />
            </TouchableOpacity>
          )
        }
    </View>
  )
};