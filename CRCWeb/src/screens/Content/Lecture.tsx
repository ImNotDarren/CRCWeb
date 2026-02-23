import { View, Text, ScrollView } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { useEffect, useState } from "react";
import VimeoVideo from "@/src/components/VimeoVideo";
import Expand from "@/src/components/Expand";
import { AppButton, AppSpinner } from "@/src/components/ui";
import RichText from "@/src/components/RichText";
import Popup from "@/src/components/Popup";
import WhiteSpace from "@/src/components/WhiteSpace";
import { openURL } from "@/utils/url";
import { useColors } from "@/hooks/useColors";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
const GITHUB_BUCKET = process.env.EXPO_PUBLIC_GITHUB_BUCKET || '';

type LectureScreenProps = {
  mid: string | string[];
  router: ReturnType<typeof import("expo-router").useRouter>;
};

export default function LectureScreen({ mid, router }: LectureScreenProps): React.ReactElement {
  const dispatch = useDispatch();
  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);
  const modules = useSelector((state: RootState) => state.module.modules);

  const found = modules.find((m) => String(m.id) === String(mid));
  const module = found ? JSON.parse(JSON.stringify(found)) : {};
  const [currVideo, setCurrVideo] = useState(0);
  const [visible, setVisible] = useState(false);

  const url = `${GITHUB_BUCKET}/slides/${mid}.pdf?`;

  useEffect(() => {
    if (module?.id) {
      if (!module.crcLectures) {
        fetch(`${SERVER_URL}/crc/modules/getModuleLecture/${mid}`, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(data => {
            const moduleCopy = JSON.parse(JSON.stringify(module));
            moduleCopy['crcLectures'] = data;
            const modulesCopy = JSON.parse(JSON.stringify(modules));
            const m = modulesCopy.find((x: { id: number }) => String(x.id) === String(mid));
            if (m) m.crcLectures = data;
            dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
          })
          .catch(error => console.error(error));
      }
    }
  }, [mid, dispatch]);

  const handleEdit = () => {
    router.push(`/edit?screen=lecture&mid=${mid}`);
  };

  if (!module?.crcLectures)
    return (
      <View style={styles.spinnerView}>
        <AppSpinner size="large" />
      </View>
    );

  return (
    <>
      <ScrollView style={styles.moduleContainer}>
        {(module?.crcLectures?.length > currVideo) && (
          <View>
            <VimeoVideo
              vimeoId={module.crcLectures[currVideo].link}
            />
            {module.crcLectures[currVideo].transcript && <View style={styles.buttonArea}>
              <AppButton
                appearance='outline'
                status='basic'
                style={styles.transcriptButton}
                onPress={() => setVisible(true)}
              >
                Transcript
              </AppButton>
              <AppButton
                appearance='outline'
                status='info'
                style={styles.slidesButton}
                onPress={() => openURL(url)}
              >
                Slides
              </AppButton>
            </View>}
            <View style={{ height: 1, backgroundColor: colors.borderLight, marginHorizontal: 20, marginBottom: 10 }} />
            <Text style={styles.lectureNote}>{module.crcLectures[currVideo].note}</Text>
            <View style={styles.buttonView}>
              {currVideo > 0 &&
                <AppButton
                  appearance='outline'
                  status='warning'
                  style={{ width: 100, flexWrap: 'nowrap' }}
                  onPress={() => setCurrVideo(curr => curr - 1)}
                >
                  Prev
                </AppButton>}
              <Expand />
              {currVideo < module.crcLectures.length - 1 &&
                <AppButton
                  appearance='outline'
                  style={{ width: 100, flexWrap: 'nowrap' }}
                  onPress={() => setCurrVideo(curr => curr + 1)}
                >
                  Next
                </AppButton>}
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
