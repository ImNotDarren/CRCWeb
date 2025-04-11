import { ScrollView, View } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CustomMapView from "../../components/Location/map";
import { Spinner } from "@ui-kitten/components";
import Config from "react-native-config";

export default function UserLocationsScreen({ navigation, route }) {

  const { user } = route.params;

  const fontSize = useSelector(state => state.fontSize);
  const styles = getStyles(fontSize);

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${Config.SERVER_URL}/crc/locations/findAllByUserId/${user.id}`)
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
  }, [user]);

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