import { ScrollView, View, TouchableOpacity, RefreshControl } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { useState } from "react";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import { AppInput } from "@/src/components/ui";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingActionButton from "@/src/components/FloatingActionButton";
import { useRouter } from "expo-router";
import { useFeatureUsers } from "@/hooks/api";
import { useColors } from "@/hooks/useColors";
import { ThemedScrollView } from "@/src/components/ThemedScrollView";
import { ThemedView } from "@/src/components/ThemedView";

export default function AdminScreen(): React.ReactElement {
  const router = useRouter();
  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);
  const [value, setValue] = useState("");
  const { users: allUsers, loading: refreshing, refetch } = useFeatureUsers(3);
  const currentUsers = value.length > 0
    ? allUsers.filter(
        (u) =>
          u.username?.toLowerCase().includes(value.toLowerCase()) ||
          `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase().includes(value.toLowerCase())
      ) as Array<{ id: number; username: string; firstName: string; lastName: string }>
    : (allUsers as Array<{ id: number; username: string; firstName: string; lastName: string }>);

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.inputView}>
        <AppInput
          textStyle={styles.inputText}
          style={{ flex: 1 }}
          value={value}
          onChangeText={setValue}
          accessoryRight={() => (
            <TouchableOpacity
              onPress={() => {
                setValue("");
              }}
            >
              <MaterialCommunityIcons name='close-circle' size={20} color={colors.icon} />
            </TouchableOpacity>
          )}
        />
      </View>
      <ThemedScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refetch()} />}
        style={styles.container}
      >
        {
          currentUsers.map(u => (
            <CustomizeMenuItem
              key={u.id}
              title={`${u.firstName} ${u.lastName}`}
              subtitle={u.username}
              onNavigate={() => router.push(`/user-info/${u.id}`)}
            />
          ))
        }
        <View style={styles.bottomWhiteSpace} />
      </ThemedScrollView>
      <FloatingActionButton
        icon='plus'
        onPress={() => router.push('/add-user')}
      />
    </ThemedView>
  );
}
