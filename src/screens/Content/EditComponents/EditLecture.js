import { View, Text } from "react-native";
import getStyles from "./style";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomizeMenuItem } from "../../../components/CustomizeMenuItem";
import Popup from "../../../components/Popup";
import { Button, Input, Spinner } from "@ui-kitten/components";
import WhiteSpace from "../../../components/WhiteSpace";
import Config from "react-native-config";

export default function EditLecture({ navigation, mid }) {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state) => state.module.modules);
  
  const dispatch = useDispatch();

  const module = modules.find((m) => m.id === mid);

  const [visible, setVisible] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editTranscript, setEditTranscript] = useState("");
  const [editNote, setEditNote] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Edit Lecture",
    });
  }, []);

  const handlePopup = (lid) => () => {
    const lecture = module.crcLectures.find((l) => l.id === lid);
    setSelectedLecture(lecture);
    setEditTitle(lecture.title);
    setEditLink(lecture.link);
    setEditTranscript(lecture.transcript);
    setEditNote(lecture.note);
    setVisible(true);
  };

  const handleChange = (e, func) => {
    func(e);
  };

  const reset = () => {
    setVisible(false);
    setSelectedLecture(null);
    setEditTitle("");
    setEditLink("");
    setEditTranscript("");
    setEditNote("");
  };

  const handleDelete = async () => {
    reset();
  };

  const handleUpdate = async () => {
    setLoading("update");

    if (!editTitle || !editLink) {
      setError("All fields are required");
      return setLoading(false);
    }

    if (editTitle === selectedLecture.title && editLink === selectedLecture.link && editTranscript === selectedLecture.transcript && editNote === selectedLecture.note) {
      setLoading(false);
      return reset();
    }

    // update lecture
    try {
      await fetch(`${Config.SERVER_URL}/crc/lectures/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedLecture.id,
          title: editTitle,
          link: editLink,
          transcript: editTranscript,
          note: editNote,
        }),
      });

      const modulesCopy = JSON.parse(JSON.stringify(modules));
      const moduleCopy = modulesCopy.find((m) => m.id === mid);
      const lectureCopy = moduleCopy.crcLectures.find((l) => l.id === selectedLecture.id);
      lectureCopy.title = editTitle;
      lectureCopy.link = editLink;
      lectureCopy.transcript = editTranscript;
      lectureCopy.note = editNote;
      dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
      setLoading(false);
      reset();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <View>
      {
        module?.crcLectures?.map((lecture, i) => (
          <CustomizeMenuItem
            key={i}
            title={lecture.title}
            onNavigate={handlePopup(lecture.id)}
          />
        ))
      }
      <Popup
        visible={visible}
        setVisible={setVisible}
        title={`Edit Lecture`}
      >
        <View style={styles.popupContainer}>
          <Input
            label="Title"
            value={editTitle}
            onChangeText={(e) => handleChange(e, setEditTitle)}
            style={styles.popupInput}
            textStyle={styles.popupText}
          />
          <Input
            label="Vimeo ID"
            value={editLink}
            onChangeText={(e) => handleChange(e, setEditLink)}
            style={styles.popupInput}
            textStyle={styles.popupText}
          />
          <Input
            label="Transcript"
            value={editTranscript}
            onChangeText={(e) => handleChange(e, setEditTranscript)}
            style={styles.popupInput}
            textStyle={styles.popupText}
            multiline
          />
          <Input
            label="Note"
            value={editNote}
            onChangeText={(e) => handleChange(e, setEditNote)}
            style={styles.popupInput}
            textStyle={styles.popupText}
            multiline
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.buttonContainer}>
            <Button
              appearance="outline"
              status="danger"
              style={[styles.button, { marginRight: 20 }]}
              onPress={handleDelete}
              accessoryLeft={loading === "delete" ? () => <Spinner size="small" status="danger" /> : null}
              disabled={loading !== false}
            >
              Delete
            </Button>
            <Button
              appearance="outline"
              status="primary"
              style={styles.button}
              onPress={handleUpdate}
              accessoryLeft={loading === "update" ? () => <Spinner size="small" status="info" /> : null}
              disabled={loading !== false}
            >
              Update
            </Button>
          </View>
        </View>
        <WhiteSpace />
      </Popup>
    </View>
  );
};