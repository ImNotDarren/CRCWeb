import { ScrollView, Text, View } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import { Toggle } from "@ui-kitten/components";
import FitbitPanel from "@/src/components/FitbitPanel";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

export default function UserInfoScreen() {
  const { userId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const fontSize = useSelector(state => state.font.fontSize);
  const styles = getStyles(fontSize);
  const [user, setUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [activityPermission, setActivityPermission] = useState(false);
  const [fitbitPermission, setFitbitPermission] = useState(false);
  const [loginCount, setLoginCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    fetch(`${SERVER_URL}/user/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);

  useEffect(() => {
    if (!user) return;
    navigation.setOptions({
      title: `${user.firstName} ${user.lastName}`,
    });
  }, [user, navigation]);

  useEffect(() => {
    fetch(`${SERVER_URL}/crc/permission/findByUserId/${user.id}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setUserPermissions(data);
          setActivityPermission(data.find(p => p.type === "activity") ? true : false);
          setFitbitPermission(data.find(p => p.type === "fitbit") ? true : false);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [user]);

  const getLoginCount = () => {
    if (!user) return;
    fetch(`${SERVER_URL}/log/findByUserId/${user.id}`)
      .then(response => response.json())
      .then(data => {
        setLoginCount(data.length);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    getLoginCount();
  }, [user]);

  const handleActivityPermissionChange = () => {
    setActivityPermission(curr => !curr);
  }

  const handleFitbitPermissionChange = () => {
    setFitbitPermission(curr => !curr);
  }

  const createPermission = (type, uid) => {
    fetch(`${SERVER_URL}/crc/permission/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, uid }),
    })
      .then(response => response.json())
      .then(data => {
        setUserPermissions(curr => [...curr, data]);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const deletePermission = (pid) => {
    fetch(`${SERVER_URL}/crc/permission/${pid}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        setUserPermissions(curr => curr.filter(p => p.id !== pid));
      })
      .catch(err => {
        console.error(err);
      });
  };

  const changePermission = (type, permission) => {
    if (type === "create")
      return createPermission(permission, user.id);

    const pid = userPermissions.find(p => p.type === permission).id;
    return deletePermission(pid);
  }

  useEffect(() => {
    if (Array.isArray(userPermissions)) {
      const originalAcitvityPermission = userPermissions.find(p => p.type === "activity") ? true : false;
      const originalFitbitPermission = userPermissions.find(p => p.type === "fitbit") ? true : false;

      if (activityPermission !== originalAcitvityPermission) {
        changePermission(activityPermission ? "create" : "delete", "activity");
      }

      if (fitbitPermission !== originalFitbitPermission) {
        changePermission(fitbitPermission ? "create" : "delete", "fitbit");
      }
    }

  }, [activityPermission, changePermission, user]);

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
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
          <Toggle
            checked={activityPermission}
            onChange={handleActivityPermissionChange}
          />
        }
      />
      <CustomizeMenuItem
        title="Fitbit Permission"
        icon="run"
        accessoryRight={
          <Toggle
            checked={fitbitPermission}
            onChange={handleFitbitPermissionChange}
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
        <FitbitPanel user={user} />
      </View>

    </ScrollView>
  )
}