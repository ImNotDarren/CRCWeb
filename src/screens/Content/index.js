import { Linking, Alert, RefreshControl, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Spinner } from "@ui-kitten/components";
import { CustomizeMenuItem } from "../../components/CustomizeMenuItem";
import { useEffect, useState } from "react";
import { NestableScrollContainer, NestableDraggableFlatList, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Config from "react-native-config";



export default function ContentScreen({ navigation }) {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  
  const user = useSelector((state) => state.user.user);
  const modules =useSelector((state) => state.module.modules);
  const dispatch = useDispatch();

  // const surveyURL = 'https://redcap.emory.edu/surveys/?s=8FHH87R7LPY8Y3W3';

  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${Config.SERVER_URL}/crc/modules/getModuleByRole`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.id,
          role: user.featureUsers[3].role,
        }),
      });
      const data = await response.json();
      dispatch({ type: 'UPDATE_MODULES', value: data });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  useEffect(() => {
    if (modules.length === 0) {
      fetchData();
    }
  }, [modules, fetchData]);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator activeScale={1.05}>
        <CustomizeMenuItem
          title={`${item.id} ${item.name}`}
          icon="menu"
          progress={item.crcModuleProgresses && item.crcModuleProgresses.length > 0 ? item.crcModuleProgresses[0].progress : null}
          onNavigate={() => navigation.navigate('ContentHome', { mid: item.id })}
          drag={drag}
          active={isActive}
        />
      </ScaleDecorator>
    );
  };

  const handleSaveOrder = ({ data }) => {
    // TODO: save order in database
  };

  if (modules.length === 0)
    return (
      <View style={styles.spinnerView}>
        <Spinner size="giant" status="info" />
      </View>
    );

  return (
    <GestureHandlerRootView>
      <NestableScrollContainer
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        style={styles.container}
      >
        {/* <CustomizeMenuItem title="Before Survey" icon="form-select" onNavigate={handleSurvey} /> */}
        {/* <Divider style={styles.divider} /> */}
        {modules.length > 0 ? (user.featureUsers[3].role !== 'admin' ? modules.map((m, idx) => (
          <CustomizeMenuItem
            key={m.id}
            title={`${idx + 1}  ${m.name}`}
            icon='school'
            progress={m.crcModuleProgresses && m.crcModuleProgresses.length > 0 ? m.crcModuleProgresses[0].progress : null}
            onNavigate={() => navigation.navigate('ContentHome', { mid: m.id })}
          />
        )) :
          <>
            <NestableDraggableFlatList
              data={modules}
              renderItem={renderItem}
              keyExtractor={(item) => `draggable-item-${item.id}`}
              onDragEnd={handleSaveOrder}
              scrollEnabled={false}
            />
          </>
        ) : <Spinner />
        }
        {/* <Divider style={styles.divider} /> */}
        {/* <CustomizeMenuItem title="After Survey" icon="form-select" onNavigate={handleSurvey} /> */}

      </NestableScrollContainer>
    </GestureHandlerRootView>
  );
}