import { ScrollView, TouchableOpacity, View } from "react-native";
import styles from "../style";
import { Button, Input, Spinner } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../../../../theme/colors";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomizeMenuItem } from "../../../components/CustomizeMenuItem";

import { SERVER_URL } from "../../../../constants";

const getExpectedRoles = (role) => {
  const adminRoles = ['admin', 'superadmin'];
  switch (role.toLowerCase()) {
    case 'patient':
      return ['caregiver', ...adminRoles];
    case 'caregiver':
      return ['patient', ...adminRoles];
    default:
      return ['patient', 'caregiver', ...adminRoles];
  }
}

export default function Pair() {

  const [value, setValue] = useState("");
  const [searching, setSearching] = useState(false);
  const [pairing, setPairing] = useState(false);
  const [users, setUsers] = useState([]); // [id, email, username, firstName, lastName]

  const user = useSelector((state) => state.user);
  const expectedRoles = getExpectedRoles(user.user.featureUsers[3].role);
  

  const dispatch = useDispatch();

  const handleSearch = () => {
    fetch(`${SERVER_URL}/user/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fid: 3,
        attributes: ['id', 'email', 'username', 'firstName', 'lastName'],
        limit: 5,
        searchString: value,
        status: 'Active',
        exUids: [user.user.id],
      })
    })
      .then(response => response.json())
      .then(data => {
        setUsers(data.filter(u => expectedRoles.includes(u.featureUsers[0].role)));
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setSearching(false));
  };

  const handlePair = (u) => async () => {
    setPairing(true);
    fetch(`${SERVER_URL}/pairs/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user1Id: user.user.id,
        user2Id: u.id,
        user1Status: 'Confirmed',
        user2Status: 'Pending',
        fid: 3,
      })
    })
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: 'UPDATE_PAIRED',
          value: [
            {
              user1Id: user.user.id,
              user1: null,
              user1Status: 'Confirmed',
              user2Id: u.id,
              user2: u,
              user2Status: 'Pending',
              featureId: 3,
            },
            ...user.paired
          ]
        });
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setPairing(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Input
          value={value}
          style={{ flex: 1, marginRight: 10 }}
          textStyle={styles.inputText}
          onChangeText={(e) => setValue(e)}
          accessoryRight={() => (
            <TouchableOpacity
              onPress={() => setValue("")}
            >
              <MaterialCommunityIcons name='close-circle' size={20} color={colors.grey[300]} />
            </TouchableOpacity>
          )}
        />
        <Button
          style={{ height: 51, }}
          disabled={searching}
          onPress={handleSearch}
          accessoryLeft={() => searching ? <Spinner size="small" status="info" /> : null}
        >
          Search
        </Button>
      </View>
      <ScrollView style={{ marginTop: 20, }}>
        {users.map((u, i) => (
          <CustomizeMenuItem
            key={u.id}
            title={`${u.firstName} ${u.lastName}`}
            subtitle={u.email}
            icon="account"
            accessoryRight={
              <Button
                size="small"
                appearance="outline"
                onPress={handlePair(u)}
                disabled={pairing}
                style={{ marginRight: 10 }}
                accessoryRight={() => pairing ? <Spinner size="tiny" status="info" /> : null}
              >
                Pair
              </Button>
            }
          />
        ))}
      </ScrollView>
    </View>

  )
}