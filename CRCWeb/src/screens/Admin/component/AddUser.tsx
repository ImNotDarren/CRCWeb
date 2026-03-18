import React, { useState } from 'react';
import getStyles from "../style";
import { useSelector } from 'react-redux';
import type { RootState } from '@/src/types/store';
import { Text, TouchableOpacity, View } from "react-native";
import { AppButton, AppInput, AppSelect, AppSelectItem } from "@/src/components/ui";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from "react-native-flash-message";
import { alert } from '@/utils/alert';
import { useRouter } from 'expo-router';
import { useCreateFeatureUser } from '@/hooks/api';
import { useColors } from '@/hooks/useColors';
import { ThemedScrollView } from '@/src/components/ThemedScrollView';

const roleTitleMap: Record<number, string> = {
  1: "patient",
  2: "caregiver",
  3: "admin",
  4: "superadmin",
};

export default function AddUser(): React.ReactElement {
  const router = useRouter();
  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<number | null>(null);
  const { createUser } = useCreateFeatureUser();

  const handleAddUser = () => {
    if (!email || !firstName || !lastName || role === null) {
      return showMessage({
        message: "Please fill in all fields",
        type: "danger",
      });
    }

    createUser({
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
      .then((data) => {
        if (data.error)
          return showMessage({
            message: data.error,
            type: "danger",
          });
        if (data?.err?.message)
          return showMessage({
            message: data.err.message,
            type: "danger",
          });

        if (data.message)
          return showMessage({
            message: data.message,
            type: "danger",
          });

        if (data.success) {
          showMessage({
            message: "Successfully created!",
            type: "success",
          });
          return router.back();
        }

        showMessage({
          message: "An unexpected error occurred. Please try again later.",
          type: "danger",
        });
      })
      .catch(() => {
        alert("Error", "An error occurred. Please try again later.");
      });
  };

  return (
    <>
      <ThemedScrollView style={styles.addUserContainer}>
        <Text style={styles.title}>Email</Text>
        <AppInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          textStyle={styles.inputText}
          style={styles.input}
          accessoryRight={() => (
            <TouchableOpacity
              onPress={() => setEmail("")}
            >
              <MaterialCommunityIcons name='close-circle' size={20} color={colors.icon} />
            </TouchableOpacity>
          )}
        />
        <Text style={styles.title}>Name</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            textStyle={styles.inputText}
            style={[styles.input, { marginRight: 5 }]}
          />
          <AppInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            textStyle={styles.inputText}
            style={[styles.input, { marginLeft: 5 }]}
          />
        </View>
        <Text style={styles.title}>Role</Text>
        <AppSelect
          value={role !== null ? roleTitleMap[role] : undefined}
          onSelect={(index) => setRole(index + 1)}
          placeholder="Select role"
        >
          {Object.values(roleTitleMap).map((roleLabel) => (
            <AppSelectItem key={roleLabel} title={roleLabel} />
          ))}
        </AppSelect>
      </ThemedScrollView>
      <View style={styles.buttonContainer}>
        <AppButton
          appearance="outline"
          status="danger"
          style={[styles.button, { marginRight: 20 }]}
          onPress={() => router.back()}
        >
          Cancel
        </AppButton>
        <AppButton
          appearance="outline"
          style={styles.button}
          onPress={handleAddUser}
        >
          Confirm
        </AppButton>
      </View>
    </>
  );
}
