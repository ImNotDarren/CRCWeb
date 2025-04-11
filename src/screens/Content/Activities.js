import { ScrollView, RefreshControl, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CustomizeMenuItem } from "../../components/CustomizeMenuItem";
import WhiteSpace from "../../components/WhiteSpace";
import { Spinner } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../../../theme/colors";
import Config from "react-native-config";

export default function ActivityScreen({ mid, navigation }) {

  const dispatch = useDispatch();
  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state) => state.module.modules);
  const user = useSelector((state) => state.user.user);

  const module = modules.find((m) => m.id === mid);
  const [refreshing, setRefreshing] = useState(false);

  const getData = () => {
    setRefreshing(true);
  
    fetch(`${Config.SERVER_URL}/crc/modules/getModuleAssignment/${mid}/${user.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(async data => {
        // Create deep copies of the state to avoid direct mutation
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        
        // Fetch the completed status for each assignment
        // const updatedCrcAssignments = await Promise.all(
        //   data.map(async (assignment) => {
        //     const response = await fetch(`${Config.SERVER_URL}/log/find/`, {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify({
        //         condition: {
        //           action: "Complete",
        //           target: `CRCwebAssignmentContent-${assignment.id}`,
        //           userId: user.id,
        //         }
        //       }),
        //     });
        //     const d = await response.json();
        //     assignment.completed = d.length > 0;
        //     return assignment;
        //   })
        // );
  
        // Update the moduleCopy and modulesCopy with the new crcAssignments
        // moduleCopy.crcAssignments = updatedCrcAssignments;
        // const updatedModules = modulesCopy.map((m) =>
        //   m.id === mid ? { ...m, crcAssignments: updatedCrcAssignments } : m
        // );

        modulesCopy.find((m) => m.id === mid).crcAssignments = data;
  
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
  }, [mid, server, dispatch]);

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
              onNavigate={content ? () => navigation.navigate('ActivityPage', { aid: content.id, mid: mid }) : { mid: mid }}
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