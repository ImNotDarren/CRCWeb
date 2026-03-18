import { ScrollView, View } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { AppSpinner } from "@/src/components/ui";
import { useLocalSearchParams } from "expo-router";
import { useLocationsByUser } from "@/hooks/api";
import { useColors } from "@/hooks/useColors";
import { ThemedScrollView } from "@/src/components/ThemedScrollView";

export default function UserLocationsScreen(): React.ReactElement {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const uid = userId ? Number(userId) : null;
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const colors = useColors();
  const styles = getStyles(fontSize, colors);

  const { locations, loading } = useLocationsByUser(uid);

  return (
    <>
      <ThemedScrollView style={[styles.container, { paddingHorizontal: 20 }]}>
        {/* <CustomMapView locations={locations} /> */}
      </ThemedScrollView>
      {loading && <View style={styles.loadingContainer}>
        <AppSpinner size="large" />
      </View>}
    </>
  );
}
