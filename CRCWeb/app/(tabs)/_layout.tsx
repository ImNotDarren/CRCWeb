import { useEffect } from 'react';
import {
  NativeTabs,
  Icon,
  Label,
  VectorIcon,
} from 'expo-router/unstable-native-tabs';
import type { ImageSourcePropType } from 'react-native';
import { Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { ColorValue } from 'react-native';

type VectorIconFamily = {
  getImageSource: (name: string, size: number, color: ColorValue) => Promise<ImageSourcePropType | null>;
};

const MaterialCommunityIconFamily = {
  getImageSource: (MaterialCommunityIcons as unknown as { getImageSource: VectorIconFamily['getImageSource'] }).getImageSource,
} as VectorIconFamily;
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from 'expo-router';
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
  const { permissions } = usePermissionsByUser(userId);

  useEffect(() => {
    if (currentVersion?.name) {
      navigation.setOptions({ title: currentVersion.name });
    }
  }, [currentVersion, navigation]);

  useEffect(() => {
    dispatch({ type: 'UPDATE_PERMISSIONS', value: permissions });
  }, [permissions, dispatch]);

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
      <NativeTabs.Trigger name="fitbit" hidden={!fitbitPermission || Platform.OS === 'web'}>
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
