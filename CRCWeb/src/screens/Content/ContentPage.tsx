import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { useEffect, useState, useCallback } from "react";
import RichText from "@/src/components/RichText";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import WhiteSpace from "@/src/components/WhiteSpace";
import { AppInput } from "@/src/components/ui";
import { canEdit } from "@/utils/user";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useColors } from "@/hooks/useColors";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

export default function ContentPageScreen(): React.ReactElement {
  const { cid, mid } = useLocalSearchParams<{ cid: string; mid: string }>();
  const navigation = useNavigation();
  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const modules = useSelector((state: RootState) => state.module.modules);
  const content = modules.find((m) => String(m.id) === String(mid))?.crcContents?.find((c: { id: number }) => String(c.id) === String(cid));

  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(content?.crcContentPage?.title || "");
  const [editValue, setEditValue] = useState(content?.crcContentPage?.content || "");
  const [isBottom, setIsBottom] = useState(false);

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number }; contentSize: { height: number }; layoutMeasurement: { height: number } } }) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isBottomReached =
      contentOffset.y + layoutMeasurement.height >= contentSize.height;
    setIsBottom(isBottomReached);
  };

  const handleSaveProgress = useCallback(async () => {
    if (!user?.user?.id) return;
    try {
      await fetch(`${SERVER_URL}/log/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.user.id,
          action: "Complete",
          target: `CRCwebContentPage-${cid}`,
        }),
      });
      const modulesCopy = JSON.parse(JSON.stringify(modules));
      const m = modulesCopy.find((x: { id: number }) => String(x.id) === String(mid));
      const c = m?.crcContents?.find((x: { id: number }) => String(x.id) === String(cid));
      if (c) c.completed = true;
      dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
    } catch (error) {
      console.error(error);
    }
  }, [user, cid, modules, mid, dispatch]);

  useEffect(() => {
    if (isBottom && content && !content.completed) {
      handleSaveProgress();
    }
  }, [isBottom, content, handleSaveProgress]);

  const handleSave = useCallback(async () => {
    try {
      if (content?.crcContentPage?.content) {
        await fetch(`${SERVER_URL}/crc/contentpages/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cid: cid,
            content: editValue,
            title: editTitle,
          }),
        });
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
        const c = moduleCopy?.crcContents?.find((x: { id: number }) => String(x.id) === String(cid));
        if (c?.crcContentPage) {
          c.crcContentPage.content = editValue;
          c.crcContentPage.title = editTitle;
        }
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
      } else {
        await fetch(`${SERVER_URL}/crc/contentpages/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cid: cid,
            content: editValue,
            title: editTitle,
          }),
        });

        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
        const c = moduleCopy?.crcContents?.find((x: { id: number }) => String(x.id) === String(cid));
        if (c) c.crcContentPage = { content: editValue, title: editTitle, crcContentId: Number(cid) };
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setEdit(curr => !curr);
    }
  }, [content, modules, mid, cid, editValue, editTitle, dispatch]);

  const handleEdit = useCallback(() => {
    if (!edit)
      return setEdit(curr => !curr);

    Alert.alert(
      "Save Content",
      "Do you want to save the change?",
      [
        {
          text: "Discard",
          onPress: () => {
            setEditValue(content?.crcContentPage?.content || "");
            setEditTitle(content?.crcContentPage?.title || "");
            setEdit(curr => !curr);
          },
          style: "destructive"
        },
        {
          text: "Cancel",
          onPress: () => { },
          style: "cancel"
        },
        {
          text: "Save",
          onPress: handleSave,
        },
      ]
    );
  }, [edit, content, handleSave]);

  useEffect(() => {
    navigation.setOptions({
      title: content?.crcContentPage?.title || 'Content',
      headerRight: () => (
        canEdit(user) ?
          <TouchableOpacity
            onPress={handleEdit}
          >
            <MaterialCommunityIcons name={edit ? "check-bold" : "pencil"} size={20} color={edit ? colors.success : colors.text} style={{ padding: 10 }} />
          </TouchableOpacity> : null
      ),
    });
  }, [content, user, handleEdit, edit, editValue, editTitle, navigation]);

  return (
    <>
      {!edit ? (
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.contentPageView}
        >
          <RichText text={content?.crcContentPage?.content || ""} fontSize={20 + fontSize} lineHeight={27 + fontSize * 2} />
          <WhiteSpace />
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.contentPageView}
        >
          <AppInput
            value={editTitle}
            onChangeText={setEditTitle}
            style={[styles.textInput, { marginBottom: 10 }]}
            textStyle={{ fontSize: 20 + fontSize }}
          />
          <TextInput
            value={editValue}
            onChangeText={setEditValue}
            style={[styles.textInput, { flex: 1 }]}
            multiline
          />
          <WhiteSpace />
        </KeyboardAvoidingView>
      )}
    </>
  );
}
