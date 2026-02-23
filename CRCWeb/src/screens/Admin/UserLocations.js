import { ScrollView, View } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Spinner } from "@ui-kitten/components";
import { useLocalSearchParams } from "expo-router";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

export default function UserLocationsScreen() {
  const { userId } = useLocalSearchParams();

  const fontSize = useSelector(state => state.font.fontSize);
  const styles = getStyles(fontSize);

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`${SERVER_URL}/crc/locations/findAllByUserId/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data.err) return console.error(data.err);
        setLocations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  return (
    <>
      <ScrollView style={[styles.container, { paddingHorizontal: 20 }]}>
        {/* <CustomMapView locations={locations} /> */}
      </ScrollView>
      {loading && <View style={styles.loadingContainer}>
        <Spinner size='giant' />
      </View>}
    </>
  )
}