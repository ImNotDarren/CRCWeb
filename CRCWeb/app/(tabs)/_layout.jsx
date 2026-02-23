import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from 'expo-router';
import { alert } from '@/utils/alert';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

export default function TabsLayout() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentVersion = useSelector((state) => state.version.currentVersion);
  const user = useSelector((state) => state.user);
  const fitbitPermission = user.permissions?.find((p) => p.type === 'fitbit');

  useEffect(() => {
    if (currentVersion?.name) {
      navigation.setOptions({ title: currentVersion.name });
    }
  }, [currentVersion, navigation]);

  useEffect(() => {
    const currUser = user.user;
    if (!currUser?.id) return;
    fetch(`${SERVER_URL}/crc/permission/findByUserId/${currUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: 'UPDATE_PERMISSIONS', value: data });
      })
      .catch((err) => alert('Error', err.message));
  }, [user.user?.id, dispatch]);

  const tabIcon = (name, color, size) => (
    <View>
      <MaterialCommunityIcons name={name} color={color} size={size} />
    </View>
  );

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => tabIcon('home', color, size),
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          title: 'Content',
          tabBarIcon: ({ color, size }) => tabIcon('school', color, size),
        }}
      />
      <Tabs.Screen
        name="fitbit"
        options={{
          title: 'Fitbit',
          tabBarIcon: ({ color, size }) => tabIcon('fire-circle', color, size),
          href: fitbitPermission && Platform.OS !== 'web' ? '/fitbit' : null,
        }}
      />
      <Tabs.Screen
        name="survey"
        options={{
          title: 'Survey',
          tabBarIcon: ({ color, size }) => tabIcon('form-select', color, size),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarIcon: ({ color, size }) => tabIcon('account', color, size),
        }}
      />
    </Tabs>
  );
}
