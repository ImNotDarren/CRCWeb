import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CustomizeMenuItem } from "../../components/CustomizeMenuItem";
import { Input } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../../../theme/colors";
import FloatingActionButton from "../../components/FloatingActionButton";

import { SERVER_URL } from "../../../constants";

export default function AdminScreen({ navigation }) {

  const fontSize = useSelector(state => state.fontSize);
  const styles = getStyles(fontSize);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [value, setValue] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setRefreshing(true);
    fetch(`${SERVER_URL}/feature/3/users`)
      .then(response => response.json())
      .then(data => {
        setAllUsers(data);
        setCurrentUsers(data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (value.length > 0) {
      setCurrentUsers(allUsers.filter(user => user.username.toLowerCase().includes(value.toLowerCase()) || `${user.firstName} ${user.lastName}`.toLowerCase().includes(value.toLowerCase())));
    } else {
      setCurrentUsers(allUsers);
    }
  }, [value]);

  return (
    <>
      <View style={styles.inputView}>
        <Input
          textStyle={styles.inputText}
          style={{ flex: 1 }}
          value={value}
          onChangeText={setValue}
          accessoryRight={() => (
            <TouchableOpacity
              onPress={() => {
                setValue("");
                setCurrentUsers(allUsers);
              }}
            >
              <MaterialCommunityIcons name='close-circle' size={20} color={colors.grey[300]} />
            </TouchableOpacity>
          )}
        />
      </View>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getData} />}
        style={styles.container}
      >
        {
          currentUsers.map(user => (
            <CustomizeMenuItem
              key={user.id}
              title={`${user.firstName} ${user.lastName}`}
              subtitle={user.username}
              onNavigate={() => navigation.navigate('UserInfo', { user })}
            />
          ))
        }
        <View style={styles.bottomWhiteSpace} />
      </ScrollView>
      <FloatingActionButton
        icon='plus'
        onPress={() => navigation.navigate('Add User')}
      />
    </>
  )
}