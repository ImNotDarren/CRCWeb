import { Linking, Alert, RefreshControl, View, ScrollView } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Spinner } from "@ui-kitten/components";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import { useEffect, useState, useCallback } from "react";
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NoContent from "@/src/components/NoContent";
import { canEdit } from "@/utils/user";
import { useRouter } from "expo-router";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

export default function ContentScreen() {
  const router = useRouter();

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);

  const user = useSelector((state) => state.user);
  const modules = useSelector((state) => state.module.modules);
  const currentVersion = useSelector((state) => state.version.currentVersion);
  const dispatch = useDispatch();

  const [fetched, setFetched] = useState(false);

  // const surveyURL = 'https://redcap.emory.edu/surveys/?s=8FHH87R7LPY8Y3W3';

  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    const uid = user?.user?.id;
    const role = user?.user?.featureUsers?.[3]?.role;
    const vid = currentVersion?.id;
    if (!uid || !role || !vid) {
      setFetched(true);
      return;
    }
    try {
      const response = await fetch(`${SERVER_URL}/crc/modules/getModuleByRole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          role: role.toLowerCase(),
          vid,
        }),
      });

      const data = await response.json();
      const list = Array.isArray(data) ? data : (data?.modules ?? []);
      dispatch({ type: 'UPDATE_MODULES', value: list });
    } catch (error) {
      console.error(error);
    } finally {
      setFetched(true);
    }
  }, [user?.user?.id, user?.user?.featureUsers?.[3]?.role, currentVersion?.id, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  useEffect(() => {
    if (!fetched) {
      fetchData();
    }
  }, [fetched, fetchData]);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator activeScale={1.05}>
        <CustomizeMenuItem
          title={`${item.id} ${item.name}`}
          icon="menu"
          progress={item.crcModuleProgresses && item.crcModuleProgresses.length > 0 ? item.crcModuleProgresses[0].progress : null}
          onNavigate={() => router.push(`/content-home/${item.id}`)}
          drag={drag}
          active={isActive}
        />
      </ScaleDecorator>
    );
  };

  const handleSaveOrder = ({ data }) => {
    // TODO: save order in database
  };

  if (!fetched)
    return (
      <View style={styles.spinnerView}>
        <Spinner size="giant" status="info" />
      </View>
    );

  if (fetched && modules.length === 0) {
    return (
      <NoContent action={(
        <Button onPress={handleRefresh}>Refresh</Button>
      )} />
    );
  }

  return (
    <GestureHandlerRootView style={[styles.container, { flex: 1 }]}>
      {!canEdit(user) ? (
        <ScrollView style={styles.container} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
          {modules.map((m, idx) => (
            <CustomizeMenuItem
              key={m.id}
              title={`${idx + 1}  ${m.name}`}
              icon='school'
              progress={m.crcModuleProgresses && m.crcModuleProgresses.length > 0 ? m.crcModuleProgresses[0].progress : null}
              onNavigate={() => router.push(`/content-home/${m.id}`)}
            />
          ))}
        </ScrollView>
      ) : (
        <DraggableFlatList
          data={modules}
          renderItem={renderItem}
          keyExtractor={(item) => `draggable-item-${item.id}`}
          onDragEnd={handleSaveOrder}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          style={styles.container}
        />
      )}
    </GestureHandlerRootView>
  );
}