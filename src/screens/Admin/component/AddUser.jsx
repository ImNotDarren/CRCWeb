import React, { useState } from 'react';
import getStyles from "../style";
import { useSelector } from 'react-redux';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, Input, Select, SelectItem } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from "react-native-flash-message";
import colors from '../../../../theme/colors';
import { alert } from '../../../../utils/alert';

import { SERVER_URL } from '../../../../constants';

export default function AddUser({ navigation }) {

  const fontSize = useSelector(state => state.font.fontSize);
  const styles = getStyles(fontSize);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState(null);

  const roleTitleMap = {
    1: "Patient",
    2: "Caregiver",
    3: "Admin",
    4: "SuperAdmin",
  };

  const handleAddUser = () => {
    if (!email || !firstName || !lastName || !role) {
      return showMessage({
        message: "Please fill in all fields",
        type: "danger",
      });
    }

    fetch(`${SERVER_URL}/user/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        email,
        firstName,
        lastName,
        loginType: 'local',
        isBot: '0',
        fid: 3,
        role: roleTitleMap[role],
        status: 'Active',
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error)
          return showMessage({
            message: data.error,
            type: "danger",
          })
        if (data?.err?.message)
          return showMessage({
            message: data.err.message,
            type: "danger",
          })

        if (data.message)
          return showMessage({
            message: data.message,
            type: "danger",
          })

        if (data.success) {
          showMessage({
            message: "Successfully created!",
            type: "success",
          });
          return navigation.goBack();
        }

        showMessage({
          message: "An unexpected error occurred. Please try again later.",
          type: "danger",
        });

      })
      .catch(err => {
        console.error(err);
        alert("Error", "An error occurred. Please try again later.");
      })

  };

  return (
    <>
      <ScrollView style={styles.addUserContainer}>
        <Text style={styles.title}>Email</Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          textStyle={styles.inputText}
          style={styles.input}
          accessoryRight={() => (
            <TouchableOpacity
              onPress={() => setEmail("")}
            >
              <MaterialCommunityIcons name='close-circle' size={20} color={colors.grey[300]} />
            </TouchableOpacity>
          )}
        />
        <Text style={styles.title}>Name</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Input
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            textStyle={styles.inputText}
            style={[styles.input, { marginRight: 5 }]}
          />
          <Input
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            textStyle={styles.inputText}
            style={[styles.input, { marginLeft: 5 }]}
          />
        </View>
        <Text style={styles.title}>Role</Text>
        <Select
          value={role && roleTitleMap[role]}
          selectedIndex={role}
          onSelect={index => setRole(index)}
        >
          {Object.values(roleTitleMap).map((role, idx) => (
            <SelectItem key={idx} title={role} />
          ))}
        </Select>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          appearance="outline"
          status="danger"
          style={[styles.button, { marginRight: 20 }]}
          onPress={() => navigation.goBack()}
        >
          Cancel
        </Button>
        <Button
          appearance="outline"
          style={styles.button}
          onPress={handleAddUser}
        >
          Confirm
        </Button>
      </View>
    </>
  )
}
