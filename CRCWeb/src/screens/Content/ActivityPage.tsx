import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { useEffect, useState, useCallback } from "react";
import RichText from "@/src/components/RichText";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import WhiteSpace from "@/src/components/WhiteSpace";
import { AppButton, AppInput } from "@/src/components/ui";
import { alert } from "@/utils/alert";
import { showMessage } from "react-native-flash-message";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useColors } from "@/hooks/useColors";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

export default function ActivityPageScreen(): React.ReactElement {
  const { aid, mid } = useLocalSearchParams<{ aid: string; mid: string }>();
  const navigation = useNavigation();
  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);
  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  const modules = useSelector((state: RootState) => state.module.modules);
  const moduleForMid = modules.find((m) => String(m.id) === String(mid));
  const activity = moduleForMid?.crcAssignments?.find((a: { id: number }) => String(a.id) === String(aid));

  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(activity?.crcAssignmentContent?.title || "");
  const [editValue, setEditValue] = useState(activity?.crcAssignmentContent?.content || "");

  const handleSave = useCallback(async () => {
    try {
      if (activity?.crcAssignmentContent?.content) {
        const response = await fetch(`${SERVER_URL}/crc/assignmentcontents/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aid: aid,
            content: editValue,
            title: editTitle,
          }),
        });
        const data = await response.json();

        if (data?.message === "Successfully updated!") {
          showMessage({
            message: "Success",
            description: "Content updated successfully",
            type: "success",
          });
          const modulesCopy = JSON.parse(JSON.stringify(modules));
          const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
          const a = moduleCopy?.crcAssignments?.find((c: { id: number }) => String(c.id) === String(aid));
          if (a?.crcAssignmentContent) {
            a.crcAssignmentContent.content = editValue;
            a.crcAssignmentContent.title = editTitle;
          }
          dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        } else {
          showMessage({
            message: "Error",
            description: data.message || "Failed to update content",
            type: "danger",
          });
        }
      } else {
        await fetch(`${SERVER_URL}/crc/assignmentcontents/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cid: aid,
            content: editValue,
            title: editTitle,
          }),
        });

        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
        const a = moduleCopy?.crcAssignments?.find((x: { id: number }) => String(x.id) === String(aid));
        if (a) a.crcAssignmentContent = { content: editValue, title: editTitle, crcAssignmentId: Number(aid) };
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setEdit(curr => !curr);
    }
  }, [activity, modules, mid, aid, editValue, editTitle, dispatch]);

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
            setEditValue(activity?.crcAssignmentContent?.content || "");
            setEditTitle(activity?.crcAssignmentContent?.title || "");
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
  }, [edit, activity, handleSave]);

  useEffect(() => {
    navigation.setOptions({
      title: activity?.crcAssignmentContent?.title || 'Content',
      headerRight: () => (
        user?.featureUsers?.[3]?.role === 'admin' ?
          <TouchableOpacity
            onPress={handleEdit}
          >
            <MaterialCommunityIcons name={edit ? "check-bold" : "pencil"} size={20} color={edit ? colors.success : colors.text} style={{ padding: 10 }} />
          </TouchableOpacity> : null
      ),
    });
  }, [activity, user, handleEdit, edit, editValue, editTitle, navigation]);

  const handleReaction = (reaction: boolean) => async () => {
    if (!activity?.crcAssignmentContent?.id) return;
    try {
      const response = await fetch(`${SERVER_URL}/crc/assignmentcontents/createUserAssignmentContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user?.id,
          acid: activity.crcAssignmentContent.id,
          value: reaction,
        }),
      });
      const data = await response.json();
      const modulesCopy = JSON.parse(JSON.stringify(modules));
      const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
      const a = moduleCopy?.crcAssignments?.find((c: { id: number }) => String(c.id) === String(aid));
      if (a?.crcAssignmentContent) a.crcAssignmentContent.crcUserAssignmentContents = [data];
      dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
    } catch (error) {
      console.error(error);
    }
  };

  const thumbUpSelected = activity?.crcAssignmentContent?.crcUserAssignmentContents?.find((uac: { value: boolean }) => uac.value === true);
  const thumbDownSelected = activity?.crcAssignmentContent?.crcUserAssignmentContents?.find((uac: { value: boolean }) => uac.value === false);

  return (
    <>
      {!edit ? (
        <ScrollView style={styles.contentPageView}>
          <RichText text={activity?.crcAssignmentContent?.content || ""} fontSize={20 + fontSize} lineHeight={27 + fontSize * 2} />
          <Text style={styles.question}>Was this intervention effective?</Text>
          <View style={styles.evaluateView}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.evaluateButton}
              onPress={handleReaction(true)}
            >
              <MaterialCommunityIcons name="thumb-up" size={40} color={thumbDownSelected ? colors.border : colors.success} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.evaluateButton}
              onPress={handleReaction(false)}
            >
              <MaterialCommunityIcons name="thumb-down" size={40} color={thumbUpSelected ? colors.border : colors.error} />
            </TouchableOpacity>
          </View>
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
        </KeyboardAvoidingView>
      )}
    </>
  );
}
