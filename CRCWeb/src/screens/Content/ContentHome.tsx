import { View, Text, TouchableOpacity, Pressable } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { useEffect, useState, useRef } from "react";
import LectureScreen from "./Lecture";
import ContentHeader from "./Header";
import { Button, TopNavigationAction } from "@ui-kitten/components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "@/theme/colors";
import ContentsScreen from "./Content";
import ResourcesScreen from "./Resources";
import Popup from "@/src/components/Popup";
import FloatingActionButton from "@/src/components/FloatingActionButton";
import ActivityScreen from "./Activities";
import { canEdit, isAdmin } from "@/utils/user";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useSetModuleProgress } from "@/hooks/api";

const MENU_ITEMS = ['Content', 'Activities', 'Resources', 'Lecture'];

export default function ContentHomeScreen(): React.ReactElement {
  const { mid } = useLocalSearchParams<{ mid: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const [currPage, setCurrPage] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef({ openMenu: () => {} });
  menuRef.current.openMenu = () => setMenuVisible(true);

  const [visible, setVisible] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const module = useSelector((state: RootState) =>
    state.module.modules.find((m) => String(m.id) === String(mid))
  );
  const modules = useSelector((state: RootState) => state.module.modules);
  const dispatch = useDispatch();
  const { setProgress } = useSetModuleProgress();

  const renderMap: Record<string, React.ReactElement> = {
    'Content': <ContentsScreen mid={mid} router={router} />,
    'Activities': <ActivityScreen mid={mid} router={router} />,
    'Resources': <ResourcesScreen mid={mid} />,
    'Lecture': <LectureScreen mid={mid} router={router} />,
  };

  useEffect(() => {
    const id = setTimeout(() => {
      navigation.setOptions({
        title: module?.name || 'Content',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => menuRef.current.openMenu()}
            style={{ padding: 10 }}
          >
            <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.grey[500]} />
          </TouchableOpacity>
        ),
      });
    }, 0);
    return () => clearTimeout(id);
  }, [module?.name, mid, navigation]);

  useEffect(() => {
    if (module?.crcModuleProgresses?.length && renderMap) {
      const userProgress = module.crcModuleProgresses[0].progress;
      if (userProgress > 0 && userProgress < 1) {
        setCurrPage(Math.ceil(MENU_ITEMS.length * userProgress));
      }
    }
  }, []);

  useEffect(() => {
    if (isAdmin(user.user?.featureUsers?.[3]?.role)) return;
    const currProgress = currPage / MENU_ITEMS.length;
    if (currProgress === 0) return;
    if (module?.crcModuleProgresses?.length && currProgress <= module.crcModuleProgresses[0].progress) return;

    setProgress(mid, user.user?.id, currProgress)
      .then((res) => {
        if (res && !('message' in res)) {
          const modulesCopy = JSON.parse(JSON.stringify(modules));
          const newModule = modulesCopy.find((m: { id: number }) => m.id === Number(mid));
          if (newModule?.crcModuleProgresses) {
            newModule.crcModuleProgresses = [res, ...newModule.crcModuleProgresses];
          } else {
            newModule.crcModuleProgresses = [res];
          }
          dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        }
      })
      .catch((err) => console.error(err));
  }, [currPage]);

  const handleBack = () => {
    setCurrPage(curr => curr === 0 ? 0 : curr - 1);
  };

  const handleForward = () => {
    setCurrPage(curr => curr === MENU_ITEMS.length - 1 ? curr : curr + 1);
  };

  const handleFinish = () => {
    if (module?.crcQuizUsers?.length === 0 || (module?.crcQuizUsers && module.crcQuizUsers[module.crcQuizUsers.length - 1].score < 0.8))
      return setVisible(true);

    router.push('/(tabs)');
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
    router.push(`/edit?screen=${MENU_ITEMS[currPage].toLowerCase()}&mid=${mid}`);
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
        title={MENU_ITEMS[currPage]}
        forwardAction={canEdit(user) ? <EditAction /> : null}
      />
      {renderMap[MENU_ITEMS[currPage]]}

      <View style={styles.navigationButtonView}>
        {currPage > 0 ? <FloatingActionButton
          icon="arrow-left"
          onPress={handleBack}
          positioning={false}
        /> : <View style={{ width: 50 }} />}
        {currPage < MENU_ITEMS.length - 1 && <FloatingActionButton
          icon="arrow-right"
          onPress={handleForward}
          positioning={false}
        />}
        {currPage === MENU_ITEMS.length - 1 && <FloatingActionButton
          icon="check-bold"
          onPress={handleFinish}
          positioning={false}
          color={colors.green[400]}
        />}
      </View>

      <Popup
        visible={menuVisible}
        setVisible={setMenuVisible}
        animationTime={100}
        closeIcon={true}
      >
        <View style={{ padding: 8, minWidth: 180 }}>
          {MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item}
              onPress={() => {
                setMenuVisible(false);
                setCurrPage(index);
              }}
              style={{ paddingVertical: 12, paddingHorizontal: 8, borderRadius: 4 }}
            >
              <Text style={{ fontSize: 16, color: currPage === index ? colors.blue[500] : colors.grey[500] }}>
                {item}
              </Text>
            </Pressable>
          ))}
          {user?.user?.featureUsers?.[3]?.role === 'admin' && (
            <Pressable
              onPress={() => {
                setMenuVisible(false);
                router.push(`/quiz/${mid}`);
              }}
              style={{ paddingVertical: 12, paddingHorizontal: 8, borderRadius: 4, borderTopWidth: 1, borderTopColor: colors.grey[200] }}
            >
              <Text style={{ fontSize: 16, color: colors.grey[500] }}>Quiz</Text>
            </Pressable>
          )}
        </View>
      </Popup>

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
                router.push(`/quiz/${mid}`);
              }}
            >
              Yes
            </Button>
          </View>
        </View>
      </Popup>
    </View>
  );
}
