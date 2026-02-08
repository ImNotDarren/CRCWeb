import { ScrollView, Text, View } from "react-native";
import styles from "./style";
import { useSelector } from "react-redux";
import { getPendingPairs } from "../../../utils/user";
import { Button, Divider, Spinner } from "@ui-kitten/components";
import { useState } from "react";
import { CustomizeMenuItem } from "../../components/CustomizeMenuItem";

export default function PendingPairsScreen({ navigation }) {

  const user = useSelector((state) => state.user);

  const pending = getPendingPairs(user);

  const [pairing, setPairing] = useState(false);

  const handlePair = (pair, status) => async () => {

  }

  return (
    <ScrollView style={styles.container}>
      {pending.length > 0 ? pending.map(pair => (
        <CustomizeMenuItem
          key={pair.id}
          title={pair.user1 ? `${pair.user1.firstName} ${pair.user1.lastName}` : `${pair.user2.firstName} ${pair.user2.lastName}`}
          subTitle={pair.user1 ? pair.user1.email : pair.user2.email}
          icon="account"
          accessoryRight={
            <View style={styles.buttonView}>
              <Button
                size="small"
                appearance="outline"
                onPress={handlePair(pair, "Confirmed")}
                disabled={pairing}
                style={{ marginRight: 10 }}
                accessoryRight={() => pairing ? <Spinner size="tiny" status="info" /> : null}
              >
                Pair
              </Button>
              <Button
                size="small"
                appearance="outline"
                status="danger"
                onPress={handlePair(pair, "Rejected")}
                disabled={pairing}
                style={{ marginRight: 10 }}
                accessoryRight={() => pairing ? <Spinner size="tiny" status="info" /> : null}
              >
                Reject
              </Button>
            </View>
          }
        />
      )) : (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>No pending pairs</Text>
        </View>
      )}
    </ScrollView>
  );
}