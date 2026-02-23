import { ScrollView, View } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { Spinner } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";
import { useLocationsByUser } from "@/hooks/api";

export default function UserLocationsScreen(): React.ReactElement {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const uid = userId ? Number(userId) : null;

  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);

  const { locations, loading } = useLocationsByUser(uid);

  return (
    <>
      <ScrollView style={[styles.container, { paddingHorizontal: 20 }]}>
        {/* <CustomMapView locations={locations} /> */}
      </ScrollView>
      {loading && <View style={styles.loadingContainer}>
        <Spinner size='giant' />
      </View>}
    </>
  );
}
