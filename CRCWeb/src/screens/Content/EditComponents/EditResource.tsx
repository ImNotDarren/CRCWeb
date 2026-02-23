import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import getStyles from "./style";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import { useEffect, useState } from "react";
import Popup from "@/src/components/Popup";
import { Button, Input, Spinner } from "@ui-kitten/components";
import { extractUrl, removeUrls } from "@/utils/url";
import { useNavigation } from "expo-router";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

type EditResourceProps = {
  router: ReturnType<typeof import("expo-router").useRouter>;
  mid: string | string[];
};

type ResourceItem = { id: number; content: string };

export default function EditResource({ router, mid }: EditResourceProps): React.ReactElement {
  const navigation = useNavigation();

  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state: RootState) => state.module.modules);

  const dispatch = useDispatch();

  const module = modules.find((m) => String(m.id) === String(mid));

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState<boolean | string>(false);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    navigation.setOptions({
      title: "Edit Resource",
    });
  }, []);

  const reset = () => {
    setVisible(false);
    setValue("");
    setSelectedResource(null);
    setError("");
  };

  const handlePopup = (cid: number) => () => {
    const resource = module?.crcWebResources?.find((c: ResourceItem) => c.id === cid);
    if (!resource) return;
    setSelectedResource(resource);
    setValue(resource.content);
    setVisible(true);
  };

  const handleUpdate = async () => {
    setLoading("update");

    if (!value) {
      setLoading(false);
      setError("All fields are required");
      return;
    }

    if (!selectedResource) return;

    try {
      await fetch(`${SERVER_URL}/crc/webresources/updateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedResource.id,
          content: value,
        }),
      });
      const modulesCopy = JSON.parse(JSON.stringify(modules));
      const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
      const r = moduleCopy?.crcWebResources?.find((c: ResourceItem) => c.id === selectedResource.id);
      if (r) r.content = value;
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
    if (!module?.crcWebResources) return;

    fetch(`${SERVER_URL}/crc/webresources/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mid: mid,
        content: value,
        index: module.crcWebResources.length,
      }),
    })
      .then(response => response.json())
      .then(data => {
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
        if (moduleCopy?.crcWebResources) moduleCopy.crcWebResources.push(data);
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
    if (!selectedResource) return;

    fetch(`${SERVER_URL}/crc/webresources/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedResource.id,
        allContents: JSON.stringify(module?.crcWebResources)
      }),
    })
      .then(response => response.json())
      .then(() => {
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const moduleCopy = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
        if (moduleCopy?.crcWebResources) moduleCopy.crcWebResources = moduleCopy.crcWebResources.filter((c: ResourceItem) => c.id !== selectedResource.id);
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
        module?.crcWebResources?.map((resource: ResourceItem, index: number) => {
          if (extractUrl(resource.content))
            return (
              <CustomizeMenuItem
                key={resource.id}
                title={removeUrls(resource.content)}
                onNavigate={handlePopup(resource.id)}
              />
            );

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              onPress={handlePopup(resource.id)}
            >
              <Text style={styles.resourcesTitle} >{resource.content}</Text>
            </TouchableOpacity>
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
          <Text style={styles.resourcesTitle}>Edit Content</Text>
          <Input
            value={value}
            onChangeText={setValue}
            placeholder="Content"
            style={styles.popupInput}
            textStyle={styles.popupText}
            multiline
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
            onPress={selectedResource ? handleUpdate : handleCreate}
            accessoryLeft={loading === "update" ? () => <Spinner size="small" status="info" /> : undefined}
            disabled={loading !== false}
          >
            {selectedResource ? "Update" : "Create"}
          </Button>
        </View>
      </Popup>
    </View>
  );
}
