import { View, Text, ScrollView } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ViemoVideo from "../../components/VimeoVideo";
import Expand from "../../components/Expand";
import { Button, Divider, Spinner } from "@ui-kitten/components";
import colors from "../../../theme/colors";
import RichText from "../../components/RichText";
import Popup from "../../components/Popup";
import FloatingActionButton from "../../components/FloatingActionButton";
import { openURL } from "../../../utils/url";
import WhiteSpace from "../../components/WhiteSpace";

import { GITHUB_BUCKET, SERVER_URL } from "../../../constants";

export default function LectureScreen({ mid, navigation }) {

  
  const dispatch = useDispatch();
  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state) => state.module.modules);
  const user = useSelector((state) => state.user.user);

  // const [module, setModule] = useState(modules.find((m) => m.id === mid) ? JSON.parse(JSON.stringify(modules.find((m) => m.id === mid))) : {});
  const module = modules.find((m) => m.id === mid) ? JSON.parse(JSON.stringify(modules.find((m) => m.id === mid))) : {};
  const [currVideo, setCurrVideo] = useState(0);
  const [visible, setVisible] = useState(false);

  const url = `${GITHUB_BUCKET}/slides/${mid}.pdf?`;

  useEffect(() => {
    if (module) {
      if (!module.crcLectures) {
        fetch(`${SERVER_URL}/crc/modules/getModuleLecture/${mid}`, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(data => {
            const moduleCopy = JSON.parse(JSON.stringify(module));
            moduleCopy['crcLectures'] = data;
            // setModule(moduleCopy);
            const modulesCopy = JSON.parse(JSON.stringify(modules));
            modulesCopy.find((m) => m.id === mid).crcLectures = data;
            dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
          })
          .catch(error => console.error(error));
      }
    }
  }, [mid, dispatch]);

  const handleEdit = () => {
    navigation.navigate('Edit', { screen: "lecture", mid: mid });
  };

  if (!module?.crcLectures)
    return (
      <View style={styles.spinnerView}>
        <Spinner size="giant" status="info" />
      </View>
    );

  return (
    <>
      {/* {user?.featureUsers[3]?.role === 'admin' &&
        <FloatingActionButton icon="pencil" onPress={handleEdit} />} */}
      <ScrollView style={styles.moduleContainer}>

        {(module?.crcLectures?.length > currVideo) && (
          <View>
            <ViemoVideo
              vimeoId={module.crcLectures[currVideo].link}
            />
            {module.crcLectures[currVideo].transcript && <View style={styles.buttonArea}>
              <Button
                appearance='outline'
                status='basic'
                style={styles.transcriptButton}
                onPress={() => setVisible(true)}
              >
                Transcript
              </Button>
              <Button
                appearance='outline'
                status='info'
                style={styles.slidesButton}
                onPress={() => openURL(url)}
              >
                Slides
              </Button>
            </View>}
            <Divider style={{ backgroundColor: colors.grey[100], marginHorizontal: 20, marginBottom: 10, }} />
            <Text style={styles.lectureNote}>{module.crcLectures[currVideo].note}</Text>
            <View style={styles.buttonView}>
              {currVideo > 0 &&
                <Button
                  appearance='outline'
                  status='warning'
                  style={{ width: 100, flexWrap: 'nowrap' }}
                  onPress={() => setCurrVideo(curr => curr - 1)}
                >
                  Prev
                </Button>}
              <Expand />
              {currVideo < module.crcLectures.length - 1 &&
                <Button
                  appearance='outline'
                  style={{ width: 100, flexWrap: 'nowrap' }}
                  onPress={() => setCurrVideo(curr => curr + 1)}
                >
                  Next
                </Button>}
            </View>
            <WhiteSpace height={100} />
            <Popup
              visible={visible}
              setVisible={setVisible}
              animationTime={100}
              closeIcon={true}
            >
              <View>
                <Text style={styles.transcriptTitleText}>Transcript</Text>
              </View>
              <ScrollView style={styles.transcriptContent}>
                <RichText text={module.crcLectures[currVideo].transcript} fontSize={18 + fontSize} />
              </ScrollView>
            </Popup>
          </View>
        )}
      </ScrollView>
    </>
  );
}