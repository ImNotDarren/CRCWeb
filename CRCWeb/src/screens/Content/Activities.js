import { ScrollView, RefreshControl, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CustomizeMenuItem } from "../../components/CustomizeMenuItem";
import WhiteSpace from "../../components/WhiteSpace";
import { Spinner } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../../../theme/colors";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

export default function ActivityScreen({ mid, router }) {

  const dispatch = useDispatch();
  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state) => state.module.modules);
  const user = useSelector((state) => state.user.user);

  const module = modules.find((m) => String(m.id) === String(mid));
  const [refreshing, setRefreshing] = useState(false);

  const getData = () => {
    setRefreshing(true);
  
    fetch(`${SERVER_URL}/crc/modules/getModuleAssignment/${mid}/${user.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(async data => {
        // Create deep copies of the state to avoid direct mutation
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        modulesCopy.find((m) => String(m.id) === String(mid)).crcAssignments = data;
  
        // Dispatch the updated state
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
        <Spinner size="giant" status="info" />
      </View>
    );


  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getData} />}
        style={styles.contentsView}
      >
        {module?.crcAssignments && module?.crcAssignments?.map((content, index) => {
          return (
            <CustomizeMenuItem
              title={content.assignment.replace(/\n/g, '')}
              key={index}
              onNavigate={content ? () => router.push(`/activity-page?aid=${content.id}&mid=${mid}`) : () => {}}
              accessoryRight={
                content?.crcAssignmentContent?.crcUserAssignmentContents?.length > 0 ?
                  <MaterialCommunityIcons
                    name='check-bold'
                    size={22 + fontSize}
                    color={colors.green[400]}
                  /> :
                  null
              }
            />
          )
        })}
        <WhiteSpace height={150} />

      </ScrollView>

    </>
  );
}