import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from 'expo-router';
import { alert } from '@/utils/alert';
import type { RootState } from '@/src/types/store';
import { usePermissionsByUser } from '@/hooks/api';
import { useColors } from '@/hooks/useColors';

export default function TabsLayout(): React.ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colors = useColors();
  const currentVersion = useSelector((state: RootState) => state.version.currentVersion);
  const user = useSelector((state: RootState) => state.user);
  const fitbitPermission = user.permissions?.find((p) => p.type === 'fitbit');
  const userId = user.user?.id;
  const { permissions, refetch } = usePermissionsByUser(userId);

  useEffect(() => {
    if (currentVersion?.name) {
      navigation.setOptions({ title: currentVersion.name });
    }
  }, [currentVersion, navigation]);

  useEffect(() => {
    dispatch({ type: 'UPDATE_PERMISSIONS', value: permissions });
  }, [permissions, dispatch]);

  const tabIcon = (name: string, color: string, size: number): React.ReactElement => (
    <View>
      <MaterialCommunityIcons name={name as 'home'} color={color} size={size} />
    </View>
  );

  return (
    <Tabs
      screenOptions={
        {
          headerShown: false,
          sceneContainerStyle: { backgroundColor: colors.background },
          tabBarStyle: { backgroundColor: colors.cardBackground, borderTopColor: colors.cardBorder },
          tabBarActiveTintColor: colors.tabIconSelected,
          tabBarInactiveTintColor: colors.tabIconDefault,
        } as object
      }
    >
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
