import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import styles from './style';
import { useSelector } from 'react-redux';
import { getPendingPairs } from '@/utils/user';
import { Button, Spinner } from '@ui-kitten/components';
import { CustomizeMenuItem } from '@/src/components/CustomizeMenuItem';
import type { RootState } from '@/src/types/store';

interface PendingPair {
  id?: number;
  user1?: { firstName?: string; lastName?: string; email?: string };
  user2?: { firstName?: string; lastName?: string; email?: string };
}

export default function PendingPairsScreen(): React.ReactElement {
  const user = useSelector((state: RootState) => state.user);
  const pending = getPendingPairs(user) as PendingPair[];
  const [pairing, setPairing] = useState(false);

  const handlePair = (_pair: PendingPair, _status: string) => async (): Promise<void> => {
    // TODO: implement pair confirm/reject
  };

  return (
    <ScrollView style={styles.container}>
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
                <Button
                  size="small"
                  appearance="outline"
                  onPress={handlePair(pair, 'Confirmed')}
                  disabled={pairing}
                  style={{ marginRight: 10 }}
                  accessoryRight={() => (pairing ? <Spinner size="tiny" status="info" /> : <View />)}
                >
                  Pair
                </Button>
                <Button
                  size="small"
                  appearance="outline"
                  status="danger"
                  onPress={handlePair(pair, 'Rejected')}
                  disabled={pairing}
                  style={{ marginRight: 10 }}
                  accessoryRight={() => (pairing ? <Spinner size="tiny" status="info" /> : <View />)}
                >
                  Reject
                </Button>
              </View>
            }
          />
        ))
      ) : (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>No pending pairs</Text>
        </View>
      )}
    </ScrollView>
  );
}
