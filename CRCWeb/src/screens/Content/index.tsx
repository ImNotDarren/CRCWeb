import { Linking, RefreshControl, View, ScrollView } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { AppButton, AppSpinner } from "@/src/components/ui";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import { useEffect, useState, useCallback } from "react";
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NoContent from "@/src/components/NoContent";
import { canEdit } from "@/utils/user";
import { useRouter } from "expo-router";
import type { CRCModule } from "@/src/types/crc";
import { useModulesByRole } from "@/hooks/api";
import { useColors } from "@/hooks/useColors";
import { ThemedView } from "@/src/components/ThemedView";
import { ThemedScrollView } from "@/src/components/ThemedScrollView";

export default function ContentScreen(): React.ReactElement {
  const router = useRouter();
  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);

  const user = useSelector((state: RootState) => state.user);
  const modules = useSelector((state: RootState) => state.module.modules);
  const currentVersion = useSelector((state: RootState) => state.version.currentVersion);
  const dispatch = useDispatch();

  const uid = user?.user?.id;
  const role = user?.user?.featureUsers?.[3]?.role ?? '';
  const vid = currentVersion?.id;
  const params = uid && vid ? { uid, role: role.toLowerCase(), vid } : null;
  const { loading, refetch } = useModulesByRole(params);

  useEffect(() => {
    if (params) {
      void refetch().then((list) => dispatch({ type: 'UPDATE_MODULES', value: list }));
    }
  }, [params?.uid, params?.vid, refetch, dispatch]);

  const fetchData = useCallback(async () => {
    if (!uid || !vid) return;
    const list = await refetch();
    dispatch({ type: 'UPDATE_MODULES', value: list });
  }, [uid, vid, refetch, dispatch]);

  const handleRefresh = async () => {
    await fetchData();
  };

  const renderItem = ({ item, drag, isActive }: { item: CRCModule & { crcModuleProgresses?: { progress: number }[] }; drag: () => void; isActive: boolean }) => {
    return (
      <ScaleDecorator activeScale={1.05}>
        <CustomizeMenuItem
          title={`${item.id} ${item.name}`}
          icon="menu"
          progress={item.crcModuleProgresses && item.crcModuleProgresses.length > 0 ? item.crcModuleProgresses[0].progress : undefined}
          onNavigate={() => router.push(`/content-home/${item.id}`)}
          drag={drag}
          active={isActive}
        />
      </ScaleDecorator>
    );
  };

  const handleSaveOrder = ({ data }: { data: CRCModule[] }) => {
    // TODO: save order in database
  };

  if (loading && params)
    return (
      <ThemedView style={{ flex: 1 }}>
        <View style={styles.spinnerView}>
          <AppSpinner size="large" />
        </View>
      </ThemedView>
    );

  if (!loading && modules.length === 0) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <NoContent action={(
          <AppButton onPress={handleRefresh}>Refresh</AppButton>
        )} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView style={[styles.container, { flex: 1 }]}>
        {!canEdit(user) ? (
          <ThemedScrollView style={styles.container} refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }>
            {modules.map((m, idx) => (
              <CustomizeMenuItem
                key={m.id}
                title={`${idx + 1}  ${m.name}`}
                icon='school'
                progress={m.crcModuleProgresses && m.crcModuleProgresses.length > 0 ? m.crcModuleProgresses[0].progress : undefined}
                onNavigate={() => router.push(`/content-home/${m.id}`)}
              />
            ))}
          </ThemedScrollView>
        ) : (
          <DraggableFlatList
            data={modules}
            renderItem={renderItem}
            keyExtractor={(item) => `draggable-item-${item.id}`}
            onDragEnd={handleSaveOrder}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={handleRefresh}
              />
            }
            style={styles.container}
          />
        )}
      </GestureHandlerRootView>
    </ThemedView>
  );
}
