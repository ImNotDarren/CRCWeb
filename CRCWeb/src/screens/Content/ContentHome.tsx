import { View, Text } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { useEffect, useState } from "react";
import LectureScreen from "./Lecture";
import ContentHeader from "./Header";
import { AppButton } from "@/src/components/ui";
import ContentsScreen from "./Content";
import ResourcesScreen from "./Resources";
import Popup from "@/src/components/Popup";
import FloatingActionButton from "@/src/components/FloatingActionButton";
import ActivityScreen from "./Activities";
import { canEdit, isAdmin } from "@/utils/user";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useSetModuleProgress } from "@/hooks/api";
import { useColors } from "@/hooks/useColors";
import ContextMenu from "@/src/components/ContextMenu";
import type { ContextMenuAction } from "@/src/components/ContextMenu.web";
import { IconButton } from "@/src/components/IconButton";

const MENU_ITEMS = ['Content', 'Activities', 'Resources', 'Lecture'];

export default function ContentHomeScreen(): React.ReactElement {
  const { mid } = useLocalSearchParams<{ mid: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);
  const [currPage, setCurrPage] = useState(0);
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
    const userRole = user?.user?.featureUsers?.[3]?.role;
    const actions: ContextMenuAction[] = [
      ...MENU_ITEMS.map((item, i) => ({ title: item, selected: i === currPage })),
      ...(userRole === 'admin' ? [{ title: 'Quiz' }] : []),
    ];
    const id = setTimeout(() => {
      navigation.setOptions({
        title: module?.name || 'Content',
        headerRight: () => (
          <ContextMenu
            dropdownMenuMode
            actions={actions}
            onPress={(index) => {
              if (index < MENU_ITEMS.length) setCurrPage(index);
              else router.push(`/quiz/${mid}`);
            }}
          >
            <IconButton icon="dots-vertical" onPress={() => {}} />
          </ContextMenu>
        ),
      });
    }, 0);
    return () => clearTimeout(id);
  }, [module?.name, mid, navigation, user?.user?.featureUsers?.[3]?.role, currPage]);

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

  const handleEdit = () => {
    const screen = MENU_ITEMS[currPage].toLowerCase();
    const midStr = typeof mid === 'string' ? mid : Array.isArray(mid) ? mid[0] ?? '' : String(mid ?? '');
    if (midStr) router.push(`/edit/${screen}/${midStr}`);
  };

  const EditAction = () => (
    <IconButton icon="pencil" onPress={handleEdit} />
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
          color={colors.success}
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
            <AppButton
              appearance="outline"
              status="danger"
              style={{ flex: 1 }}
              onPress={() => setVisible(false)}
            >
              No
            </AppButton>
            <AppButton
              appearance="outline"
              style={{ flex: 1, marginLeft: 20 }}
              onPress={() => {
                setVisible(false);
                router.push(`/quiz/${mid}`);
              }}
            >
              Yes
            </AppButton>
          </View>
        </View>
      </Popup>
    </View>
  );
}
