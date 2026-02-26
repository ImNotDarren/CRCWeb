import React, { useState } from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { remove } from '@/localStorage';
import InitialsAvatar from '@/src/components/Avatar';
import getStyles from './style';
import { CustomizeMenuItem } from '@/src/components/CustomizeMenuItem';
import { useRouter } from 'expo-router';
import type { RootState } from '@/src/types/store';
import { useUserById, usePermissionsByUser } from '@/hooks/api';
import { useColors } from '@/hooks/useColors';
import { ThemedView } from '@/src/components/ThemedView';
import { ThemedScrollView } from '@/src/components/ThemedScrollView';

const AVATAR_SIZE = 90;

export default function MeScreen(): React.ReactElement {
  const router = useRouter();
  const colors = useColors();
  const user = useSelector((state: RootState) => state.user);
  const userId = user.user?.id;
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const { refetch: refetchUser } = useUserById(userId);
  const { refetch: refetchPermissions } = usePermissionsByUser(userId);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    try {
      const u = await refetchUser();
      if (u) dispatch({ type: 'UPDATE_USER', value: u });
      const perms = await refetchPermissions();
      dispatch({ type: 'UPDATE_PERMISSIONS', value: perms });
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = (): void => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: () => {
          void remove('autoLogin');
          router.replace('/login');
          dispatch({ type: 'UPDATE_USER', value: null });
          dispatch({ type: 'UPDATE_MODULES', value: [] });
        },
      },
    ]);
  };

  const u = user.user as {
    firstName: string;
    lastName: string;
    email: string;
    featureUsers?: Array<{ role: string }>;
  };
  const role = u?.featureUsers?.[3]?.role ?? '';

  return (
    <ThemedView style={styles.container}>
      <View style={styles.userinfoContainer}>
        <InitialsAvatar name={`${u?.firstName ?? ''} ${u?.lastName ?? ''}`} size={AVATAR_SIZE} />
        <View style={styles.userinfo(AVATAR_SIZE)}>
          <Text style={styles.username}>
            {u?.firstName} {u?.lastName}
          </Text>
          <Text style={styles.role}>
            {role ? `${role[0].toUpperCase()}${role.substring(1)}` : ''}
          </Text>
          <Text style={styles.email}>{u?.email}</Text>
        </View>
      </View>
      <ThemedScrollView
        style={styles.menu}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {['admin', 'superadmin'].includes(role.toLowerCase()) && (
          <CustomizeMenuItem
            title="Manage Accounts"
            icon="account-cog"
            onNavigate={() => router.push('/manage-accounts')}
          />
        )}
        <CustomizeMenuItem title="Settings" icon="cog" onNavigate={() => router.push('/settings')} />
        <CustomizeMenuItem
          title="About"
          icon="information-outline"
          onNavigate={() => router.push('/about')}
        />
        <CustomizeMenuItem
          title="Paired Accounts"
          icon="account-multiple"
          onNavigate={() => router.push('/paired-accounts')}
        />
        <CustomizeMenuItem
          title="Switch Version"
          icon="swap-horizontal-bold"
          onNavigate={() => router.replace('/versions')}
        />
        {Array.isArray(user?.permissions) &&
          user.permissions.find((p) => p.type === 'activity') && (
            <CustomizeMenuItem
              title="Activity"
              icon="run"
              onNavigate={() => router.push('/activity')}
            />
          )}
        <CustomizeMenuItem
          title="Contact Us"
          icon="account-box"
          onNavigate={() => router.push('/contact')}
        />
        <CustomizeMenuItem title="Logout" icon="logout" onNavigate={handleLogout} />
        <View style={{ height: 100 }} />
      </ThemedScrollView>
    </ThemedView>
  );
}
