import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import getStyles from "./style";
import { CustomizeMenuItem } from "../../../components/CustomizeMenuItem";
import { useEffect, useState } from "react";
import Popup from "../../../components/Popup";
import { Button, Input, Spinner } from "@ui-kitten/components";
import { extractUrl, removeUrls } from "../../../../utils/url";

import { SERVER_URL } from "../../../../constants";

export default function EditResource({ navigation, mid }) {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state) => state.module.modules);
  
  const dispatch = useDispatch();

  const module = modules.find((m) => m.id === mid);

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
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
  }

  const handlePopup = (cid) => () => {
    const resource = module.crcWebResources.find((c) => c.id === cid);
    setSelectedResource(resource);
    setValue(resource.content);
    setVisible(true);
  };

  const handleUpdate = async () => {
    setLoading("update");

    if (!value) {
      setLoading(false);
      return setError("All fields are required");
    }

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
      const moduleCopy = modulesCopy.find((m) => m.id === mid);
      moduleCopy.crcWebResources.find((c) => c.id === selectedResource.id).content = value;
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
        const moduleCopy = modulesCopy.find((m) => m.id === mid);
        moduleCopy.crcWebResources.push(data);
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

    fetch(`${SERVER_URL}/crc/webresources/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedResource.id,
        allContents: JSON.stringify(module.crcWebResources)
      }),
    })
      .then(response => response.json())
      .then(data => {
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const moduleCopy = modulesCopy.find((m) => m.id === mid);
        moduleCopy.crcWebResources = moduleCopy.crcWebResources.filter((c) => c.id !== selectedResource.id);
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
        module?.crcWebResources?.map((resource, index) => {
          if (extractUrl(resource.content))
            return (
              <CustomizeMenuItem
                key={resource.id}
                title={removeUrls(resource.content)}
                onNavigate={handlePopup(resource.id)}
              />
            )
          
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              onPress={handlePopup(resource.id)}
            >
              <Text style={styles.resourcesTitle} >{resource.content}</Text>
            </TouchableOpacity>
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
            accessoryLeft={loading === "delete" ? () => <Spinner size="small" status="danger" /> : null}
            disabled={loading !== false}
          >
            Delete
          </Button>
          <Button
            appearance="outline"
            status="primary"
            style={styles.button}
            onPress={selectedResource ? handleUpdate : handleCreate}
            accessoryLeft={loading === "update" ? () => <Spinner size="small" status="info" /> : null}
            disabled={loading !== false}
          >
            {selectedResource ? "Update" : "Create"}
          </Button>
        </View>
      </Popup>
    </View>
  )
}