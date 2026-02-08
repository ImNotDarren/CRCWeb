import { ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import getStyles from "./style";
import { CustomizeMenuItem } from "../../../components/CustomizeMenuItem";
import { useEffect, useState } from "react";
import Popup from "../../../components/Popup";
import { Button, Input, Spinner } from "@ui-kitten/components";

import { SERVER_URL } from "../../../../constants";

export default function EditContent({ navigation, mid }) {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state) => state.module.modules);
  
  const dispatch = useDispatch();

  const module = modules.find((m) => m.id === mid);

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
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
  }

  const handlePopup = (cid) => () => {
    const content = module.crcContents.find((c) => c.id === cid);
    setSelectedContent(content);
    setValue(content.content);
    setVisible(true);
  };

  const handleUpdate = async () => {
    setLoading("update");

    if (!value) {
      setLoading(false);
      return setError("All fields are required");
    }

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
      const moduleCopy = modulesCopy.find((m) => m.id === mid);
      moduleCopy.crcContents.find((c) => c.id === selectedContent.id).content = value;
      dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
      setLoading(false);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = () => {
    setLoading("update");
    if (!value)
      return setError("All fields are required");

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
        const moduleCopy = modulesCopy.find((m) => m.id === mid);
        moduleCopy.crcContents.push(data);
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        setLoading(false);
        reset();
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleDelete = async () => {
    setLoading("delete");

    fetch(`${SERVER_URL}/crc/moduleContents/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedContent.id,
        allContents: JSON.stringify(module.crcContents)
      }),
    })
      .then(response => response.json())
      .then(data => {
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const moduleCopy = modulesCopy.find((m) => m.id === mid);
        moduleCopy.crcContents = moduleCopy.crcContents.filter((c) => c.id !== selectedContent.id);
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        reset();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      {
        module?.crcContents?.map((content, index) => {
          return (
            <CustomizeMenuItem
              key={content.id}
              title={content.content}
              onNavigate={handlePopup(content.id)}
            />
          )
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
        title="Edit Content"
        onClose={reset}
      >
        <View style={styles.popupContainer}>
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
            accessoryLeft={loading === "delete" ? () => <Spinner size="small" status="danger" /> : null}
            disabled={loading !== false}
          >
            Delete
          </Button>
          <Button
            appearance="outline"
            status="primary"
            style={styles.button}
            onPress={selectedContent ? handleUpdate : handleCreate}
            accessoryLeft={loading === "update" ? () => <Spinner size="small" status="info" /> : null}
            disabled={loading !== false}
          >
            {selectedContent ? "Update" : "Create"}
          </Button>
        </View>
      </Popup>
    </View>
  )
}