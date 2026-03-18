import { ScrollView, Switch, Text, View } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { useEffect, useState } from "react";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import FitbitPanel from "@/src/components/FitbitPanel";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  useUserById,
  usePermissionsByUser,
  useLogsByUserId,
  useCreatePermission,
  useDeletePermission,
} from "@/hooks/api";
import { useColors } from "@/hooks/useColors";
import { ThemedScrollView } from "@/src/components/ThemedScrollView";

export default function UserInfoScreen(): React.ReactElement | null {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);
  const uid = userId ? Number(userId) : null;
  const { user } = useUserById(uid);
  const { permissions: userPermissions, refetch: refetchPermissions } = usePermissionsByUser(user?.id as number | undefined);
  const { logs } = useLogsByUserId(user?.id as number | undefined);
  const { createPermission } = useCreatePermission();
  const { deletePermission: deletePermissionFn } = useDeletePermission();

  const [activityPermission, setActivityPermission] = useState(false);
  const [fitbitPermission, setFitbitPermission] = useState(false);

  const loginCount = logs.length;

  useEffect(() => {
    if (user) {
      navigation.setOptions({
        title: `${user.firstName} ${user.lastName}`,
      });
    }
  }, [user, navigation]);

  const handleActivityPermissionChange = () => {
    setActivityPermission(curr => !curr);
  };

  const handleFitbitPermissionChange = () => {
    setFitbitPermission(curr => !curr);
  };

  const changePermission = (type: string, permission: string) => {
    if (type === "create" && user?.id) {
      createPermission(permission, user.id as number).then(() => refetchPermissions()).catch(console.error);
      return;
    }
    const perm = userPermissions.find((p: { type?: string }) => p.type === permission);
    if (perm?.id) {
      deletePermissionFn(perm.id).then(() => refetchPermissions()).catch(console.error);
    }
  };

  useEffect(() => {
    if (Array.isArray(userPermissions) && userPermissions.length > 0) {
      setActivityPermission(userPermissions.some((p: { type?: string }) => p.type === "activity"));
      setFitbitPermission(userPermissions.some((p: { type?: string }) => p.type === "fitbit"));
    }
  }, [userPermissions]);

  useEffect(() => {
    if (Array.isArray(userPermissions) && user?.id) {
      const originalActivity = userPermissions.some((p: { type?: string }) => p.type === "activity");
      const originalFitbit = userPermissions.some((p: { type?: string }) => p.type === "fitbit");
      if (activityPermission !== originalActivity) {
        changePermission(activityPermission ? "create" : "delete", "activity");
      }
      if (fitbitPermission !== originalFitbit) {
        changePermission(fitbitPermission ? "create" : "delete", "fitbit");
      }
    }
  }, [activityPermission, fitbitPermission]);

  useEffect(() => {
    if (user) {
      navigation.setOptions({
        title: `${user.firstName} ${user.lastName}`,
      });
    }
  }, [user, navigation]);

  if (!user) return null;

  return (
    <ThemedScrollView style={styles.container}>
      <CustomizeMenuItem
        title="Login Count"
        icon="login"
        accessoryRight={
          <Text style={styles.loginCount}>{loginCount}</Text>
        }
      />
      <CustomizeMenuItem
        title="Physical Activity Permission"
        icon="run"
        accessoryRight={
          <Switch
            value={activityPermission}
            onValueChange={handleActivityPermissionChange}
          />
        }
      />
      <CustomizeMenuItem
        title="Fitbit Permission"
        icon="run"
        accessoryRight={
          <Switch
            value={fitbitPermission}
            onValueChange={handleFitbitPermissionChange}
          />
        }
      />
      <CustomizeMenuItem
        title="Locations"
        icon="map-marker"
        onNavigate={() => router.push(`/user-locations?userId=${user.id}`)}
      />
      <View
        style={{ marginHorizontal: 20, marginVertical: 6 }}
      >
        <FitbitPanel user={{ id: Number(user.id) }} />
      </View>
    </ThemedScrollView>
  );
}
