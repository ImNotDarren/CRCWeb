import { ScrollView, RefreshControl, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { useEffect, useState } from "react";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import WhiteSpace from "@/src/components/WhiteSpace";
import { AppSpinner } from "@/src/components/ui";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColors } from "@/hooks/useColors";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

type ActivityScreenProps = {
  mid: string | string[];
  router: ReturnType<typeof import("expo-router").useRouter>;
};

export default function ActivityScreen({ mid, router }: ActivityScreenProps): React.ReactElement {
  const dispatch = useDispatch();
  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);
  const modules = useSelector((state: RootState) => state.module.modules);
  const user = useSelector((state: RootState) => state.user.user);

  const module = modules.find((m) => String(m.id) === String(mid));
  const [refreshing, setRefreshing] = useState(false);

  const getData = () => {
    setRefreshing(true);

    fetch(`${SERVER_URL}/crc/modules/getModuleAssignment/${mid}/${user?.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(async data => {
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const found = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
        if (found) found.crcAssignments = data;

        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (module) {
      if (!module.crcAssignments) {
        getData();
      }
    }
  }, [mid, dispatch]);

  if (!module?.crcAssignments)
    return (
      <View style={styles.spinnerView}>
        <AppSpinner size="large" />
      </View>
    );

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getData} />}
        style={styles.contentsView}
      >
        {module?.crcAssignments && module?.crcAssignments?.map((content: { id: number; assignment: string; crcAssignmentContent?: { crcUserAssignmentContents?: unknown[] } }, index: number) => {
          return (
            <CustomizeMenuItem
              title={content.assignment.replace(/\n/g, '')}
              key={index}
              onNavigate={content ? () => router.push(`/activity-page?aid=${content.id}&mid=${mid}`) : () => {}}
              accessoryRight={
                content?.crcAssignmentContent?.crcUserAssignmentContents?.length ? (
                  <MaterialCommunityIcons
                    name='check-bold'
                    size={22 + fontSize}
                    color={colors.success}
                  />
                ) : null
              }
            />
          );
        })}
        <WhiteSpace height={150} />
      </ScrollView>
    </>
  );
}
