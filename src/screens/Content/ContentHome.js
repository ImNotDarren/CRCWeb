import { View, Text } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LectureScreen from "./Lecture";
import ContentHeader from "./Header";
import { Button, TopNavigationAction } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "../../../theme/colors";
import ContentsScreen from "./Content";
import ResourcesScreen from "./Resources";
import AssignmentsScreen from "./Activities";
import Popup from "../../components/Popup";
import CustomOverflowMenu from "./CustomOverflowMenu";
import FloatingActionButton from "../../components/FloatingActionButton";
import ActivityScreen from "./Activities";
import Config from "react-native-config";

export default function ContentHomeScreen({ route, navigation }) {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const [currPage, setCurrPage] = useState(0);
  const [visible, setVisible] = useState(false);
  const user = useSelector((state) => state.user.user);
  

  const { mid } = route.params;
  const module = useSelector((state) => state.module.modules.find((m) => m.id === mid));
  const modules = useSelector((state) => state.module.modules)

  const dispatch = useDispatch();

  const renderMap = {
    'Lecture': <LectureScreen mid={mid} navigation={navigation} />,
    // 'Slides': <SlideScreen mid={mid} navigation={navigation} />,
    'Content': <ContentsScreen mid={mid} navigation={navigation} />,
    'Activities': <ActivityScreen mid={mid} navigation={navigation} />,
    'Resources': <ResourcesScreen mid={mid} navigation={navigation} />,
  }

  useEffect(() => {
    navigation.setOptions({
      title: module?.name || 'Content',
      headerRight: () => (
        <CustomOverflowMenu
          setPage={setCurrPage}
          menuItems={Object.keys(renderMap)}
          currPage={currPage}
          navigation={navigation}
          mid={mid}
        />
      ),
    });
  }, [module]);

  useEffect(() => {
    if (module?.crcModuleProgresses?.length > 0 && renderMap) {
      const userProgress = module.crcModuleProgresses[0].progress
      if (userProgress > 0 && userProgress < 1) {
        setCurrPage(Math.ceil(Object.keys(renderMap).length * userProgress))
      }
    }

  }, []);

  useEffect(() => {
    // save progress
    if (!["superadmin", "admin"].includes(user.featureUsers[3].role.toLowerCase())) {
      const currProgress = currPage / Object.keys(renderMap).length
      if (currProgress === 0)
        return;

      if (module?.crcModuleProgresses?.length > 0 && currProgress <= module.crcModuleProgresses[0].progress)
        return;

      fetch(`${Config.SERVER_URL}/crc/modules/setProgress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mid: mid,
          uid: user.id,
          progress: currProgress
        })
      })
        .then(response => response.json())
        .then(res => {
          if (!res.message) {
            const modulesCopy = JSON.parse(JSON.stringify(modules));
            const newModule = modulesCopy.find(m => m.id === mid);
            if (newModule.crcModuleProgresses) {
              newModule.crcModuleProgresses = [res, ...newModule.crcModuleProgresses];
            } else {
              newModule.crcModuleProgresses = [res];
            }

            dispatch({ type: 'UPDATE_MODULES', value: modulesCopy })
          }
        })
        .catch(err => {
          console.error(err)
        });
    }
  }, [currPage]);

  // console.log(module)

  const handleBack = () => {
    setCurrPage(curr => curr === 0 ? 0 : curr - 1);
  };

  const handleForward = () => {
    setCurrPage(curr => curr === Object.keys(renderMap).length - 1 ? curr : curr + 1);
  };

  const handleFinish = () => {
    if (module?.crcQuizUsers?.length === 0 || module?.crcQuizUsers[module.crcQuizUsers.length - 1].score < 0.8)
      return setVisible(true);

    navigation.navigate('Home');
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={(props) => <MaterialCommunityIcons name='arrow-left' size={20} />}
      onPress={handleBack}
      style={styles.actionButton}
    />
  );

  const ForwardAction = () => (
    <TopNavigationAction
      icon={(props) => <MaterialCommunityIcons name='arrow-right' size={18} />}
      onPress={handleForward}
      style={styles.actionButton}
    />
  );

  const FinishAction = () => (
    <TopNavigationAction
      icon={(props) => <MaterialCommunityIcons name={'check-bold'} size={18} color={colors.green[300]} />}
      onPress={handleFinish}
      style={styles.actionButton}
    />
  );

  const handleEdit = () => {
    navigation.navigate('Edit', { screen: Object.keys(renderMap)[currPage].toLowerCase(), mid: mid });
  };

  const EditAction = () => (
    <TopNavigationAction
      icon={(props) => <MaterialCommunityIcons name={'pencil'} size={18} />}
      onPress={handleEdit}
      style={styles.actionButton}
    />
  );



  return (
    <View style={styles.outsideContainer}>
      <ContentHeader
        title={Object.keys(renderMap)[currPage]}
        // backAction={currPage > 0 ? BackAction : null}
        // forwardAction={currPage < Object.keys(renderMap).length - 1 ? ForwardAction : FinishAction}
        forwardAction={user?.featureUsers[3]?.role === 'admin' ? <EditAction /> : null}
      />
      {renderMap[Object.keys(renderMap)[currPage]]}

      <View style={styles.navigationButtonView}>
        {currPage > 0 ? <FloatingActionButton
          icon="arrow-left"
          onPress={handleBack}
          positioning={false}
        /> : <View style={{ width: 50 }} />}
        {currPage < Object.keys(renderMap).length - 1 && <FloatingActionButton
          icon="arrow-right"
          onPress={handleForward}
          positioning={false}
        />}
        {currPage === Object.keys(renderMap).length - 1 && <FloatingActionButton
          icon="check-bold"
          onPress={handleFinish}
          positioning={false}
          color={colors.green[400]}
        />}
      </View>

      <Popup
        visible={visible}
        setVisible={setVisible}
        animationTime={100}
        closeIcon={false}
      >
        <View style={{ margin: 10 }}>
          <Text style={styles.popupTitle}>Are you ready for your quiz?</Text>
          <Text style={styles.popupSubtitle}>You cannot exit the quiz after starting</Text>
          <View style={styles.homePopupButtonView}>
            <Button
              appearance="outline"
              status="danger"
              style={{ flex: 1 }}
              onPress={() => setVisible(false)}
            >
              No
            </Button>
            <Button
              appearance="outline"
              style={{ flex: 1, marginLeft: 20 }}
              onPress={() => {
                setVisible(false);
                navigation.navigate('Quiz', { mid });
              }}
            >
              Yes
            </Button>
          </View>
        </View>
      </Popup>
    </View>
  );
};