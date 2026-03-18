import { useEffect } from 'react';
import { Platform } from 'react-native';
import type { ImageSourcePropType, ColorValue } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from 'expo-router';
import { Tabs } from 'expo-router';
import type { RootState } from '@/src/types/store';
import { usePermissionsByUser } from '@/hooks/api';
import { useColors } from '@/hooks/useColors';

let NativeTabs: any, Icon: any, Label: any, VectorIcon: any;
if (Platform.OS !== 'web') {
  const nativeTabsModule = require('expo-router/unstable-native-tabs');
  NativeTabs = nativeTabsModule.NativeTabs;
  Icon = nativeTabsModule.Icon;
  Label = nativeTabsModule.Label;
  VectorIcon = nativeTabsModule.VectorIcon;
}

type VectorIconFamily = {
  getImageSource: (name: string, size: number, color: ColorValue) => Promise<ImageSourcePropType | null>;
};

const MaterialCommunityIconFamily = Platform.OS !== 'web'
  ? ({
      getImageSource: (MaterialCommunityIcons as unknown as { getImageSource: VectorIconFamily['getImageSource'] }).getImageSource,
    } as VectorIconFamily)
  : null;

const TAB_CONFIG = [
  { name: 'index', icon: 'home', label: 'Home' },
  { name: 'content', icon: 'school', label: 'Content' },
  { name: 'fitbit', icon: 'fire-circle', label: 'Fitbit' },
  { name: 'survey', icon: 'form-select', label: 'Survey' },
  { name: 'me', icon: 'account', label: 'Me' },
] as const;

export default function TabsLayout(): React.ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colors = useColors();
  const currentVersion = useSelector((state: RootState) => state.version.currentVersion);
  const user = useSelector((state: RootState) => state.user);
  const fitbitPermission = user.permissions?.find((p) => p.type === 'fitbit');
  const userId = user.user?.id;
  const { permissions } = usePermissionsByUser(userId);

  useEffect(() => {
    if (currentVersion?.name) {
      navigation.setOptions({ title: currentVersion.name });
    }
  }, [currentVersion, navigation]);

  useEffect(() => {
    dispatch({ type: 'UPDATE_PERMISSIONS', value: permissions });
  }, [permissions, dispatch]);

  if (Platform.OS === 'web') {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tabIconSelected,
          tabBarInactiveTintColor: colors.tabIconDefault,
          tabBarStyle: { backgroundColor: colors.cardBackground },
          headerShown: false,
        }}
      >
        {TAB_CONFIG.map((tab) => {
          if (tab.name === 'fitbit') {
            return (
              <Tabs.Screen
                key={tab.name}
                name={tab.name}
                options={{
                  href: null,
                }}
              />
            );
          }
          return (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                title: tab.label,
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name={tab.icon} size={size} color={color} />
                ),
              }}
            />
          );
        })}
      </Tabs>
    );
  }

  return (
    <NativeTabs
      backgroundColor={colors.cardBackground}
      iconColor={{ default: colors.tabIconDefault, selected: colors.tabIconSelected }}
    >
      <NativeTabs.Trigger name="index">
        <Icon
          src={<VectorIcon family={MaterialCommunityIconFamily} name="home" />}
          selectedColor={colors.tabIconSelected}
        />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="content">
        <Icon
          src={<VectorIcon family={MaterialCommunityIconFamily} name="school" />}
          selectedColor={colors.tabIconSelected}
        />
        <Label>Content</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="fitbit" hidden={!fitbitPermission}>
        <Icon
          src={<VectorIcon family={MaterialCommunityIconFamily} name="fire-circle" />}
          selectedColor={colors.tabIconSelected}
        />
        <Label>Fitbit</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="survey">
        <Icon
          src={<VectorIcon family={MaterialCommunityIconFamily} name="form-select" />}
          selectedColor={colors.tabIconSelected}
        />
        <Label>Survey</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="me">
        <Icon
          src={<VectorIcon family={MaterialCommunityIconFamily} name="account" />}
          selectedColor={colors.tabIconSelected}
        />
        <Label>Me</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
