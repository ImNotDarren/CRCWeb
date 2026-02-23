import React, { useState } from 'react';
import { Text, View } from 'react-native';
import getStyles from './style';
import { useSelector } from 'react-redux';
import { getPendingPairs } from '@/utils/user';
import { AppButton, AppSpinner } from '@/src/components/ui';
import { CustomizeMenuItem } from '@/src/components/CustomizeMenuItem';
import type { RootState } from '@/src/types/store';
import { useColors } from '@/hooks/useColors';
import { ThemedScrollView } from '@/src/components/ThemedScrollView';

interface PendingPair {
  id?: number;
  user1?: { firstName?: string; lastName?: string; email?: string };
  user2?: { firstName?: string; lastName?: string; email?: string };
}

export default function PendingPairsScreen(): React.ReactElement {
  const user = useSelector((state: RootState) => state.user);
  const colors = useColors();
  const styles = getStyles(colors);
  const pending = getPendingPairs(user) as PendingPair[];
  const [pairing, setPairing] = useState(false);

  const handlePair = (_pair: PendingPair, _status: string) => async (): Promise<void> => {
    // TODO: implement pair confirm/reject
  };

  return (
    <ThemedScrollView style={styles.container}>
      {pending.length > 0 ? (
        pending.map((pair) => (
          <CustomizeMenuItem
            key={pair.id}
            title={
              pair.user1
                ? `${pair.user1.firstName ?? ''} ${pair.user1.lastName ?? ''}`
                : `${pair.user2?.firstName ?? ''} ${pair.user2?.lastName ?? ''}`
            }
            subtitle={pair.user1 ? pair.user1.email : pair.user2?.email}
            icon="account"
            accessoryRight={
              <View style={styles.buttonView}>
                <AppButton
                  appearance="outline"
                  onPress={handlePair(pair, 'Confirmed')}
                  disabled={pairing}
                  style={{ marginRight: 10 }}
                  accessoryLeft={() => (pairing ? <AppSpinner size="small" /> : undefined)}
                >
                  Pair
                </AppButton>
                <AppButton
                  appearance="outline"
                  status="danger"
                  onPress={handlePair(pair, 'Rejected')}
                  disabled={pairing}
                  style={{ marginRight: 10 }}
                  accessoryLeft={() => (pairing ? <AppSpinner size="small" /> : undefined)}
                >
                  Reject
                </AppButton>
              </View>
            }
          />
        ))
      ) : (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>No pending pairs</Text>
        </View>
      )}
    </ThemedScrollView>
  );
}
