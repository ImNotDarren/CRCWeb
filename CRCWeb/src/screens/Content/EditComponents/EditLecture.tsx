import { View, Text } from "react-native";
import getStyles from "./style";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import Popup from "@/src/components/Popup";
import { Button, Input, Spinner } from "@ui-kitten/components";
import WhiteSpace from "@/src/components/WhiteSpace";
import { useNavigation } from "expo-router";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

type EditLectureProps = {
  router: ReturnType<typeof import("expo-router").useRouter>;
  mid: string | string[];
};

type LectureItem = {
  id: number;
  title: string;
  link: string;
  transcript?: string | null;
  note?: string | null;
};

export default function EditLecture({ router, mid }: EditLectureProps): React.ReactElement {
  const navigation = useNavigation();

  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state: RootState) => state.module.modules);

  const dispatch = useDispatch();

  const module = modules.find((m) => String(m.id) === String(mid));

  const [visible, setVisible] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<LectureItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editTranscript, setEditTranscript] = useState("");
  const [editNote, setEditNote] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState<boolean | string>(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Edit Lecture",
    });
  }, []);

  const handlePopup = (lid: number) => () => {
    const lecture = module?.crcLectures?.find((l: LectureItem) => l.id === lid);
    if (!lecture) return;
    setSelectedLecture(lecture);
    setEditTitle(lecture.title);
    setEditLink(lecture.link);
    setEditTranscript(lecture.transcript || "");
    setEditNote(lecture.note || "");
    setVisible(true);
  };

  const handleChange = (e: string, func: (v: string) => void) => {
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
      setLoading(false);
      return;
    }

    if (!selectedLecture) {
      setLoading(false);
      return;
    }
    if (editTitle === selectedLecture.title && editLink === selectedLecture.link && editTranscript === (selectedLecture.transcript || '') && editNote === (selectedLecture.note || '')) {
      setLoading(false);
      return reset();
    }

    try {
      await fetch(`${SERVER_URL}/crc/lectures/update`, {
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
      const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
      const lectureCopy = moduleCopy?.crcLectures?.find((l: LectureItem) => l.id === selectedLecture.id);
      if (lectureCopy) {
        lectureCopy.title = editTitle;
        lectureCopy.link = editLink;
        lectureCopy.transcript = editTranscript;
        lectureCopy.note = editNote;
      }
      dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
      setLoading(false);
      reset();
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <View>
      {
        module?.crcLectures?.map((lecture: LectureItem, i: number) => (
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
      >
        <View style={styles.popupContainer}>
          <Text style={styles.lectureCardTitle}>Edit Lecture</Text>
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
              accessoryLeft={loading === "delete" ? () => <Spinner size="small" status="danger" /> : undefined}
              disabled={loading !== false}
            >
              Delete
            </Button>
            <Button
              appearance="outline"
              status="primary"
              style={styles.button}
              onPress={handleUpdate}
              accessoryLeft={loading === "update" ? () => <Spinner size="small" status="info" /> : undefined}
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
}
