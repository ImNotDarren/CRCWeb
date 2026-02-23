import { ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import getStyles from "./style";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import { useEffect, useState } from "react";
import Popup from "@/src/components/Popup";
import { Button, Input, Spinner } from "@ui-kitten/components";
import { useNavigation } from "expo-router";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

type EditContentProps = {
  router: ReturnType<typeof import("expo-router").useRouter>;
  mid: string | string[];
};

type ContentItem = { id: number; content: string };

export default function EditContent({ router, mid }: EditContentProps): React.ReactElement {
  const navigation = useNavigation();

  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state: RootState) => state.module.modules);

  const dispatch = useDispatch();

  const module = modules.find((m) => String(m.id) === String(mid));

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState<boolean | string>(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    navigation.setOptions({
      title: "Edit Content",
    });
  }, []);

  const reset = () => {
    setVisible(false);
    setValue("");
    setSelectedContent(null);
    setError("");
  };

  const handlePopup = (cid: number) => () => {
    const content = module?.crcContents?.find((c: ContentItem) => c.id === cid);
    if (!content) return;
    setSelectedContent(content);
    setValue(content.content);
    setVisible(true);
  };

  const handleUpdate = async () => {
    setLoading("update");

    if (!value) {
      setLoading(false);
      setError("All fields are required");
      return;
    }

    if (!selectedContent) return;

    try {
      await fetch(`${SERVER_URL}/crc/moduleContents/updateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedContent.id,
          content: value,
        }),
      });
      const modulesCopy = JSON.parse(JSON.stringify(modules));
      const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
      const c = moduleCopy?.crcContents?.find((x: ContentItem) => x.id === selectedContent.id);
      if (c) c.content = value;
      dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
      setLoading(false);
      reset();
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const handleCreate = () => {
    setLoading("update");
    if (!value) {
      setError("All fields are required");
      return;
    }
    if (!module?.crcContents) return;

    fetch(`${SERVER_URL}/crc/moduleContents/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mid: mid,
        content: value,
        index: module.crcContents.length,
      }),
    })
      .then(response => response.json())
      .then(data => {
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
        if (moduleCopy?.crcContents) moduleCopy.crcContents.push(data);
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        setLoading(false);
        reset();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleDelete = async () => {
    setLoading("delete");
    if (!selectedContent) return;

    fetch(`${SERVER_URL}/crc/moduleContents/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedContent.id,
        allContents: JSON.stringify(module?.crcContents)
      }),
    })
      .then(response => response.json())
      .then(() => {
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
        if (moduleCopy?.crcContents) moduleCopy.crcContents = moduleCopy.crcContents.filter((c: ContentItem) => c.id !== selectedContent.id);
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        reset();
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      {
        module?.crcContents?.map((content: ContentItem) => {
          return (
            <CustomizeMenuItem
              key={content.id}
              title={content.content}
              onNavigate={handlePopup(content.id)}
            />
          );
        })
      }
      <CustomizeMenuItem
        title="Create Content"
        icon="plus"
        onNavigate={() => setVisible(true)}
      />
      <Popup
        visible={visible}
        setVisible={setVisible}
        onClose={reset}
      >
        <View style={styles.popupContainer}>
          <Text style={styles.lectureCardTitle}>Edit Content</Text>
          <Input
            value={value}
            onChangeText={setValue}
            placeholder="Content"
            style={styles.popupInput}
            textStyle={styles.popupText}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
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
            onPress={selectedContent ? handleUpdate : handleCreate}
            accessoryLeft={loading === "update" ? () => <Spinner size="small" status="info" /> : undefined}
            disabled={loading !== false}
          >
            {selectedContent ? "Update" : "Create"}
          </Button>
        </View>
      </Popup>
    </View>
  );
}
