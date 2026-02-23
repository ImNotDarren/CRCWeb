import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import getStyles from '../style';
import { AppButton, AppInput, AppSpinner } from '@/src/components/ui';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { CustomizeMenuItem } from '@/src/components/CustomizeMenuItem';
import type { RootState } from '@/src/types/store';
import { useUserSearch, useCreatePair } from '@/hooks/api';
import type { SearchUser } from '@/hooks/api';
import { useColors } from '@/hooks/useColors';
import { ThemedView } from '@/src/components/ThemedView';
import { ThemedScrollView } from '@/src/components/ThemedScrollView';

const getExpectedRoles = (role: string): string[] => {
  const adminRoles = ['admin', 'superadmin'];
  switch (role.toLowerCase()) {
    case 'patient':
      return ['caregiver', ...adminRoles];
    case 'caregiver':
      return ['patient', ...adminRoles];
    default:
      return ['patient', 'caregiver', ...adminRoles];
  }
};

export default function Pair(): React.ReactElement {
  const [value, setValue] = useState('');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const colors = useColors();
  const styles = getStyles(colors);
  const user = useSelector((state: RootState) => state.user);
  const role = (user.user as { featureUsers?: Array<{ role: string }> })?.featureUsers?.[3]?.role ?? '';
  const expectedRoles = getExpectedRoles(role);
  const dispatch = useDispatch();
  const { search, loading: searching } = useUserSearch();
  const { createPair, loading: pairing } = useCreatePair();

  const handleSearch = (): void => {
    search({
      fid: 3,
      attributes: ['id', 'email', 'username', 'firstName', 'lastName'],
      limit: 5,
      searchString: value,
      status: 'Active',
      exUids: [user.user?.id ?? 0],
    })
      .then((data) => {
        setUsers(
          data.filter((u) => expectedRoles.includes(u.featureUsers?.[0]?.role ?? ''))
        );
      })
      .catch((err) => console.error(err));
  };

  const handlePair = (u: SearchUser) => async (): Promise<void> => {
    createPair({
      user1Id: user.user?.id,
      user2Id: u.id,
      user1Status: 'Confirmed',
      user2Status: 'Pending',
      fid: 3,
    })
      .then(() => {
        dispatch({
          type: 'UPDATE_PAIRED',
          value: [
            {
              user1Id: user.user?.id,
              user1: null,
              user1Status: 'Confirmed',
              user2Id: u.id,
              user2: u,
              user2Status: 'Pending',
              featureId: 3,
            },
            ...(user.paired ?? []),
          ],
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.input}>
        <AppInput
          value={value}
          style={{ flex: 1, marginRight: 10 }}
          textStyle={styles.inputText}
          onChangeText={(e) => setValue(e)}
          accessoryRight={() => (
            <TouchableOpacity onPress={() => setValue('')}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={colors.icon}
              />
            </TouchableOpacity>
          )}
        />
        <AppButton
          style={{ height: 51 }}
          disabled={searching}
          onPress={handleSearch}
          accessoryLeft={() => (searching ? <AppSpinner size="small" /> : undefined)}
        >
          Search
        </AppButton>
      </View>
      <ThemedScrollView style={{ marginTop: 20 }}>
        {users.map((u) => (
          <CustomizeMenuItem
            key={u.id}
            title={`${u.firstName ?? ''} ${u.lastName ?? ''}`}
            subtitle={u.email}
            icon="account"
            accessoryRight={
              <AppButton
                appearance="outline"
                onPress={handlePair(u)}
                disabled={pairing}
                style={{ marginRight: 10 }}
                accessoryLeft={() => (pairing ? <AppSpinner size="small" /> : undefined)}
              >
                Pair
              </AppButton>
            }
          />
        ))}
      </ThemedScrollView>
    </ThemedView>
  );
}
