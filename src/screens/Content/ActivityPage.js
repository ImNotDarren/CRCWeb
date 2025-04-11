import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import RichText from "../../components/RichText";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import WhiteSpace from "../../components/WhiteSpace";
import colors from "../../../theme/colors";
import { Button, Input } from "@ui-kitten/components";
import { alert } from "../../../utils/alert";
import { showMessage } from "react-native-flash-message";
import Config from "react-native-config";

export default function ActivityPageScreen({ route, navigation }) {

  const { aid, mid } = route.params;

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  
  const modules = useSelector((state) => state.module.modules);
  const activity = modules.find((m) => m.id === mid).crcAssignments.find((a) => a.id === aid);

  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(activity?.crcAssignmentContent?.title || "");
  const [editValue, setEditValue] = useState(activity?.crcAssignmentContent?.content || "");

  useEffect(() => {
    navigation.setOptions({
      title: activity?.crcAssignmentContent?.title || 'Content',
      headerRight: () => (
        user?.featureUsers[3]?.role === 'admin' ?
          <TouchableOpacity
            onPress={handleEdit}
          >
            <MaterialCommunityIcons name={edit ? "check-bold" : "pencil"} size={20} color={edit ? colors.green[400] : colors.grey[500]} style={{ padding: 10 }} />
          </TouchableOpacity> : null
      ),
    });
  }, [activity, user, handleEdit, edit, editValue, editTitle]);

  const handleSave = async () => {
    // save content
    try {
      if (activity?.crcAssignmentContent?.content) {
        const response = await fetch(`${Config.SERVER_URL}/crc/assignmentcontents/update`, {
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
          })
          const modulesCopy = JSON.parse(JSON.stringify(modules));
          const moduleCopy = modulesCopy.find((m) => m.id === mid);
          moduleCopy.crcAssignments.find((c) => c.id === aid).crcAssignmentContent.content = editValue;
          moduleCopy.crcAssignments.find((c) => c.id === aid).crcAssignmentContent.title = editTitle;
          dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        } else {
          showMessage({
            message: "Error",
            description: data.message || "Failed to update content",
            type: "danger",
          })
        }

      } else {
        await fetch(`${Config.SERVER_URL}/crc/assignmentcontents/create`, {
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
        const moduleCopy = modulesCopy.find((m) => m.id === mid);
        moduleCopy.crcAssignments.find((a) => a.id === aid).crcAssignmentContent = { content: editValue, title: editTitle, crcAssignmentId: aid };
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
            setEditValue(activity?.crcAssignmentContent?.content);
            setEditTitle(activity?.crcAssignmentContent?.title);
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

  // const handleSaveProgress = async () => {
  //   try {
  //     await fetch(`${Config.SERVER_URL}/log/create`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         uid: user.id,
  //         action: "Complete",
  //         target: `CRCwebAssignmentContent-${aid}`,
  //       }),
  //     });
  //     const modulesCopy = JSON.parse(JSON.stringify(modules));
  //     modulesCopy.find((m) => m.id === mid).crcAssignments.find((c) => c.id === aid).completed = true;
  //     dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleReaction = (reaction) => async () => {
    try {
      const response = await fetch(`${Config.SERVER_URL}/crc/assignmentcontents/createUserAssignmentContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.id,
          acid: activity.crcAssignmentContent.id,
          value: reaction,
        }),
      });
      const data = await response.json();
      const modulesCopy = JSON.parse(JSON.stringify(modules));
      const moduleCopy = modulesCopy.find((m) => m.id === mid);
      moduleCopy.crcAssignments.find((c) => c.id === aid).crcAssignmentContent.crcUserAssignmentContents = [data];
      dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
    } catch (error) {
      console.error(error);
    }
  };

  const thumbUpSelected = activity?.crcAssignmentContent?.crcUserAssignmentContents?.find((uac) => uac.value === true);
  const thumbDownSelected = activity?.crcAssignmentContent?.crcUserAssignmentContents?.find((uac) => uac.value === false);


  return (
    <>
      {!edit ? (
        <ScrollView style={styles.contentPageView}>
          <RichText text={activity?.crcAssignmentContent?.content || ""} fontSize={20 + fontSize} lineHeight={27 + fontSize * 2} />
          {/* <Button
            status={activity.completed ? "success" : "primary"}
            disabled={activity.completed}
            onPress={activity.completed ? null : handleSaveProgress}
          >
            {activity.completed ? "Completed" : "Mark as Completed"}
          </Button> */}
          <Text style={styles.question}>Was this intervention effective?</Text>
          <View style={styles.evaluateView}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.evaluateButton}
              onPress={handleReaction(true)}
            >
              <MaterialCommunityIcons name="thumb-up" size={40} color={thumbDownSelected ? colors.grey[200] : colors.green[400]} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.evaluateButton}
              onPress={handleReaction(false)}
            >
              <MaterialCommunityIcons name="thumb-down" size={40} color={thumbUpSelected ? colors.grey[200] : colors.red[400]} />
            </TouchableOpacity>
          </View>
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
        </KeyboardAvoidingView>
      )}
    </>
  );
}