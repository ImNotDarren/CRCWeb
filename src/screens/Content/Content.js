import { Text, ScrollView, TouchableOpacity, RefreshControl, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CustomizeMenuItem } from "../../components/CustomizeMenuItem";
import Popup from "../../components/Popup";
import { Button, Divider, Spinner } from "@ui-kitten/components";
import { openURL } from "../../../utils/url";
import WhiteSpace from "../../components/WhiteSpace";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../../../theme/colors";

import { SERVER_URL } from "../../../constants";

export default function ContentsScreen({ mid, navigation }) {

  
  const dispatch = useDispatch();
  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state) => state.module.modules);
  const user = useSelector((state) => state.user.user);

  const module = modules.find((m) => m.id === mid);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const url1 = "https://www.cancer.gov/publications/patient-education";
  const url2 = "https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients";

  const getCompleteStatus = () => {
    if (module?.crcContents) {
      try {
        const moduleCopy = JSON.parse(JSON.stringify(module));

        module.crcContents.forEach(async (content) => {
          const response = await fetch(`${SERVER_URL}/log/find/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              condition: {
                action: "Complete",
                target: `CRCwebContentPage-${content.id}`,
                userId: user.id,
              }
            }),
          });
          const data = await response.json();
          moduleCopy.crcContents.find((c) => c.id === content.id).completed = data.length > 0;
        });

        const modulesCopy = JSON.parse(JSON.stringify(modules));
        modulesCopy.find((m) => m.id === mid).crcContents = moduleCopy.crcContents;
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getData = () => {
    setRefreshing(true);
  
    fetch(`${SERVER_URL}/crc/modules/getModuleContent/${mid}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(async data => {
        // Create deep copies of the state to avoid direct mutation
        const moduleCopy = JSON.parse(JSON.stringify(module));
        const modulesCopy = JSON.parse(JSON.stringify(modules));
  
        // Update the crcContents with the fetched data
        const updatedCrcContents = await Promise.all(
          data.map(async (content) => {
            if (content.completed !== undefined) {
              return content;
            }
            const response = await fetch(`${SERVER_URL}/log/find/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                condition: {
                  action: "Complete",
                  target: `CRCwebContentPage-${content.id}`,
                  userId: user.id,
                }
              }),
            });
            const d = await response.json();
            content.completed = d.length > 0;
            return content;
          })
        );
  
        // Update moduleCopy and modulesCopy with the new crcContents
        moduleCopy.crcContents = updatedCrcContents;
        const updatedModules = modulesCopy.map((m) =>
          m.id === mid ? { ...m, crcContents: updatedCrcContents } : m
        );
  
        // Dispatch the updated state
        dispatch({ type: 'UPDATE_MODULES', value: updatedModules });
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (module) {
      if (!module.crcContents) {
        getData();
      }
    }
  }, [mid, dispatch]);

  if (!module?.crcContents)
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
        {module?.crcContents?.map((content, index) => {
          return (
            <CustomizeMenuItem
              title={content.content}
              key={index}
              onNavigate={content ? () => navigation.navigate('ContentPage', { cid: content.id, mid: mid }) : { mid: mid }}
              accessoryRight={
                content.completed ?
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

        <TouchableOpacity activeOpacity={0.6} onPress={() => setVisible(true)}>
          <Text style={styles.disclosure}>
            {`Disclosure:\nThe content was created by ChatGPT, drawing upon patient education materials provided by the National Cancer Institute and the National Comprehensive Cancer Network. For more information, please click here to visit the websites we provided. If you encounter any issues or have questions, please don't hesitate to contact us.`}
          </Text>
        </TouchableOpacity>

        <Popup
          visible={visible}
          setVisible={setVisible}
          animationTime={100}
        >
          <Button
            appearance="outline"
            status="info"
            onPress={() => openURL(url1)}
            style={{ marginBottom: 20 }}
          >
            National Cancer Institue
          </Button>
          <Button
            appearance="outline"
            status="info"
            onPress={() => openURL(url2)}
          >
            National Comprehensive Cancer Network
          </Button>
        </Popup>
        <WhiteSpace height={150} />

      </ScrollView>

    </>
  );
}