import React, { useEffect } from 'react';
import {
  Alert,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import getStyles from './style';
import { useDispatch, useSelector } from 'react-redux';
import { AppButton } from '@/src/components/ui';
import Pair from './components/pair';
import InitialsAvatar from '@/utils/avatar';
import Expand from '@/src/components/Expand';
import { getCurrentPair, getPendingPairs, oppositeUser } from '@/utils/user';
import Badge from '@/src/components/Badge';
import { useRouter, useNavigation } from 'expo-router';
import type { RootState } from '@/src/types/store';
import { usePairsByUser, useDeletePair } from '@/hooks/api';
import { useColors } from '@/hooks/useColors';
import { ThemedScrollView } from '@/src/components/ThemedScrollView';
import { IconButton } from '@/src/components/IconButton';

const AVATAR_SIZE = 70;

export default function PairedAccountsScreen(): React.ReactElement {
  const router = useRouter();
  const navigation = useNavigation();
  const colors = useColors();
  const styles = getStyles(colors);
  const user = useSelector((state: RootState) => state.user);
  const currentPair = getCurrentPair(user);
  const dispatch = useDispatch();
  const { loading: loadingPairs, refetch } = usePairsByUser(user.user?.id);
  const { deletePair } = useDeletePair();

  useEffect(() => {
    if (user.user?.id) {
      refetch().then((list) => {
        dispatch({ type: 'UPDATE_PAIRED', value: list });
      });
    }
  }, [user.user?.id, refetch, dispatch]);

  const handleUnpair = (): void => {
    if (!currentPair || !user.user?.id) return;
    Alert.alert('Unpair', 'Are you sure you want to unpair?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          try {
            const data = await deletePair({
              [`${currentPair.role}Id`]: (currentPair as { id?: number }).id,
              [`${oppositeUser(currentPair.role)}Id`]: user.user?.id,
              fid: 3,
            });
            if (data.message === 'Pair deleted') {
              const paired = user.paired as Array<Record<string, unknown>>;
              dispatch({
                type: 'UPDATE_PAIRED',
                value: paired.filter(
                  (p: Record<string, unknown>) =>
                    p[`${currentPair.role}Id`] !== (currentPair as { id?: number }).id ||
                    p[`${oppositeUser(currentPair.role)}Id`] !== user.user?.id
                ),
              });
              Alert.alert('Success', data.message ?? '');
              return;
            }
            if (data.message) Alert.alert('Error', data.message);
          } catch (err) {
            console.error(err);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ position: 'relative' }}>
          <Badge show={getPendingPairs(user).length > 0}>
            <IconButton
              icon="bell-outline"
              onPress={() => router.push('/pending-pairs')}
              color={colors.primary}
            />
          </Badge>
        </View>
      ),
    });
  }, [currentPair, user, navigation, router]);

  const handleRefresh = (): void => {
    refetch().then((list) => dispatch({ type: 'UPDATE_PAIRED', value: list }));
  };

  const pair = currentPair as {
    firstName?: string;
    lastName?: string;
    email?: string;
    status?: string;
    role: string;
    id?: number;
  };

  if (user?.paired?.length === 0 || !currentPair) {
    return <Pair />;
  }

  return (
    <ThemedScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loadingPairs} onRefresh={handleRefresh} />}
    >
      <View style={styles.pairContainer}>
        <InitialsAvatar
          name={`${pair.firstName ?? ''} ${pair.lastName ?? ''}`}
          size={AVATAR_SIZE}
        />
        <View style={styles.userinfo(AVATAR_SIZE)}>
          <Text style={styles.username}>
            {pair.firstName} {pair.lastName}
            {pair.status === 'Pending' && (
              <Text style={styles.pendingText}>  Pending</Text>
            )}
          </Text>
          <Text style={styles.email}>{pair.email}</Text>
        </View>
        <Expand />
        <View style={styles.unpairContainer}>
          <AppButton appearance="outline" status="danger" onPress={handleUnpair}>
            Unpair
          </AppButton>
        </View>
      </View>
    </ThemedScrollView>
  );
}
