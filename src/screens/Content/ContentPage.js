import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import RichText from "../../components/RichText";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import WhiteSpace from "../../components/WhiteSpace";
import colors from "../../../theme/colors";
import { Input } from "@ui-kitten/components";
import { alert } from "../../../utils/alert";
import Config from "react-native-config";

export default function ContentPageScreen({ route, navigation }) {

  const { cid, mid } = route.params;

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  
  const modules = useSelector((state) => state.module.modules);
  const content = modules.find((m) => m.id === mid).crcContents.find((c) => c.id === cid);

  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(content?.crcContentPage?.title || "");
  const [editValue, setEditValue] = useState(content?.crcContentPage?.content || "");

  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: content?.crcContentPage?.title || 'Content',
      headerRight: () => (
        user?.featureUsers[3]?.role === 'admin' ?
          <TouchableOpacity
            onPress={handleEdit}
          >
            <MaterialCommunityIcons name={edit ? "check-bold" : "pencil"} size={20} color={edit ? colors.green[400] : colors.grey[500]} style={{ padding: 10 }} />
          </TouchableOpacity> : null
      ),
    });
  }, [content, user, handleEdit, edit, editValue, editTitle]);

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isBottomReached =
      contentOffset.y + layoutMeasurement.height >= contentSize.height;
    setIsBottom(isBottomReached);
  };

  const handleSaveProgress = async () => {
    try {
      await fetch(`${Config.SERVER_URL}/log/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.id,
          action: "Complete",
          target: `CRCwebContentPage-${cid}`,
        }),
      });
      const modulesCopy = JSON.parse(JSON.stringify(modules));
      modulesCopy.find((m) => m.id === mid).crcContents.find((c) => c.id === cid).completed = true;
      dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (isBottom && !content.completed) {
      handleSaveProgress();
    }
  }, [isBottom]);

  const handleSave = async () => {
    // save content
    try {
      if (content?.crcContentPage?.content) {
        await fetch(`${Config.SERVER_URL}/crc/contentpages/update`, {
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
        const moduleCopy = modulesCopy.find((m) => m.id === mid);
        moduleCopy.crcContents.find((c) => c.id === cid).crcContentPage.content = editValue;
        moduleCopy.crcContents.find((c) => c.id === cid).crcContentPage.title = editTitle;
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
      } else {
        await fetch(`${Config.SERVER_URL}/crc/contentpages/create`, {
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
        const moduleCopy = modulesCopy.find((m) => m.id === mid);
        moduleCopy.crcContents.find((c) => c.id === cid).crcContentPage = { content: editValue, title: editTitle, crcContentId: cid };
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setEdit(curr => !curr);
    }
  };

  const handleEdit = () => {
    if (!edit)
      return setEdit(curr => !curr);
    
    alert(
      "Save Content",
      "Do you want to save the change?",
      [
        {
          text: "Discard",
          onPress: () => {
            setEditValue(content?.crcContentPage?.content);
            setEditTitle(content?.crcContentPage?.title);
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
  };


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
          <Input
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