import { MenuItem, OverflowMenu } from "@ui-kitten/components";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CustomOverflowMenu({ setPage, menuItems, currPage, navigation, mid }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const user = useSelector((state) => state.user.user);

  const handleSelected = (index) => {
    if (index <= menuItems.length) {
      setPage(index - 1);
      setMenuVisible(false);
      return;
    }

    if (user?.featureUsers[3]?.role === 'admin') {
      setMenuVisible(false);
      navigation.navigate('Quiz', { mid });
    }
  }

  return (
    <OverflowMenu
      anchor={() => (
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MaterialCommunityIcons name='dots-vertical' size={20} style={{ padding: 10 }} />
        </TouchableOpacity>
      )}
      visible={menuVisible}
      selectedIndex={currPage}
      onSelect={handleSelected}
      onBackdropPress={() => setMenuVisible(false)}
    >
      {menuItems.map((item, index) => (
        <MenuItem key={index} title={item} />
      ))}
      {user?.featureUsers[3]?.role === 'admin' && (
        <MenuItem title="Quiz" />
      )}
    </OverflowMenu>
  );
}