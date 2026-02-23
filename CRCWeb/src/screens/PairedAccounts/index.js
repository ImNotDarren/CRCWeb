import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./style";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "@/theme/colors";
import Pair from "./components/pair";
import InitialsAvatar from "@/utils/avatar";
import Expand from "@/src/components/Expand";
import { getCurrentPair, getPendingPairs, oppositeRole, oppositeUser } from "@/utils/user";
import Badge from "@/src/components/Badge";
import { alert } from "@/utils/alert";
import { useRouter, useNavigation } from "expo-router";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

const AVATAR_SIZE = 70;

export default function PairedAccountsScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const user = useSelector((state) => state.user);
  

  const currentPair = getCurrentPair(user);

  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();

  const fetchData = () => {
    setRefreshing(true);
    fetch(`${SERVER_URL}/pairs/user/${user.user.id}/feature/3`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application-json',
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          return dispatch({ type: 'UPDATE_PAIRED', value: [] });
        }
        dispatch({ type: 'UPDATE_PAIRED', value: data });

        // if (data[0]?.patient.length > 0) {
        //   dispatch({ type: 'UPDATE_PAIRED', value: { ...data[0].patient[0], role: 'patient' } });
        // }

        // if (data[0]?.caregiver.length > 0) {
        //   dispatch({ type: 'UPDATE_PAIRED', value: { ...data[0].caregiver[0], role: 'caregiver' } });
        // }

        // if (data[0]?.patient.length === 0 && data[0]?.caregiver.length === 0) {
        //   dispatch({ type: 'UPDATE_PAIRED', value: {} });
        // }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setRefreshing(false));
  }

  useEffect(() => {
    fetchData();
  }, [user.user]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push('/pending-pairs')}
        >
          <Badge
            show={getPendingPairs(user).length > 0}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={20}
              color={colors.primary}
              style={{ marginRight: 10 }}
            />
          </Badge>
        </TouchableOpacity>
      )
    });
  }, [currentPair, user]);

  const handleUnpair = async () => {
    alert(
      'Unpair',
      'Are you sure you want to unpair?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const response = await fetch(`${SERVER_URL}/pairs/delete`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  [`${currentPair.role}Id`]: currentPair.id,
                  [`${oppositeUser(currentPair.role)}Id`]: user.user.id,
                  fid: 3,
                })
              });

              const data = await response.json();

              if (data.message === "Pair deleted") {
                dispatch({ type: 'UPDATE_PAIRED', value: user.paired.filter(p => p[`${currentPair.role}Id`] !== currentPair.id || p[`${oppositeUser(currentPair.role)}Id`] !== user.user.id) });
                return alert('Success', data.message);
              }

              if (data.message) {
                return alert('Error', data.message);
              }

            } catch (err) {
              console.error(err);
            }
          }
        }
      ]
    )
  }

  return (
    <>
      {
        user?.paired?.length === 0 || !currentPair ?
          (<Pair />) :
          (<>
            <ScrollView
              style={styles.container}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchData}
                />
              }
            >
              <View
                style={styles.pairContainer}
              >
                <InitialsAvatar name={`${currentPair.firstName} ${currentPair.lastName}`} size={AVATAR_SIZE} />
                <View style={styles.userinfo(AVATAR_SIZE)}>
                  <Text style={styles.username}>
                    {currentPair.firstName} {currentPair.lastName}
                    {/* {currentPair?.cbwUserPair && currentPair.cbwUserPair[`${currentPair.role}Status`] === "Pending" &&  */}
                    {currentPair.status === "Pending" &&
                      <Text style={styles.pendingText}>  Pending</Text>}
                  </Text>

                  {/* <Text style={styles.role}>{currentPair[0]?.featureUsers[0]?.role}</Text> */}
                  <Text style={styles.email}>{currentPair.email}</Text>
                </View>
                <Expand />
                <View style={styles.unpairContainer}>
                  <Button
                    appearance="outline"
                    status="danger"
                    size="small"
                    onPress={handleUnpair}
                  >
                    Unpair
                  </Button>
                </View>
              </View>
            </ScrollView>

          </>)
      }
    </>
  );
};