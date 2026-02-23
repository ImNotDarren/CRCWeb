import { ScrollView, RefreshControl, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { useEffect, useState } from "react";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import Popup from "@/src/components/Popup";
import { Button, Spinner } from "@ui-kitten/components";
import { openURL } from "@/utils/url";
import WhiteSpace from "@/src/components/WhiteSpace";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from "@/theme/colors";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

type ContentsScreenProps = {
  mid: string | string[];
  router: ReturnType<typeof import("expo-router").useRouter>;
};

export default function ContentsScreen({ mid, router }: ContentsScreenProps): React.ReactElement {
  const dispatch = useDispatch();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state: RootState) => state.module.modules);
  const user = useSelector((state: RootState) => state.user.user);

  const module = modules.find((m) => String(m.id) === String(mid));
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const url1 = "https://www.cancer.gov/publications/patient-education";
  const url2 = "https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients";

  const getData = () => {
    setRefreshing(true);

    fetch(`${SERVER_URL}/crc/modules/getModuleContent/${mid}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(async data => {
        const moduleCopy = JSON.parse(JSON.stringify(module));
        const modulesCopy = JSON.parse(JSON.stringify(modules));

        const updatedCrcContents = await Promise.all(
          data.map(async (content: { id: number; completed?: boolean }) => {
            if (content.completed !== undefined) {
              return content;
            }
            const response = await fetch(`${SERVER_URL}/log/find/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                condition: {
                  action: "Complete",
                  target: `CRCwebContentPage-${content.id}`,
                  userId: user?.id,
                }
              }),
            });
            const d = await response.json();
            content.completed = d.length > 0;
            return content;
          })
        );

        moduleCopy.crcContents = updatedCrcContents;
        const updatedModules = modulesCopy.map((m: { id: number }) =>
          String(m.id) === String(mid) ? { ...m, crcContents: updatedCrcContents } : m
        );

        dispatch({ type: 'UPDATE_MODULES', value: updatedModules });
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (module) {
      if (!module.crcContents) {
        getData();
      }
    }
  }, [mid, dispatch]);

  if (!module?.crcContents)
    return (
      <View style={styles.spinnerView}>
        <Spinner size="giant" status="info" />
      </View>
    );

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getData} />}
        style={styles.contentsView}
      >
        {module?.crcContents?.map((content: { id: number; content: string; completed?: boolean }, index: number) => {
          return (
            <CustomizeMenuItem
              title={content.content}
              key={index}
              onNavigate={content ? () => router.push(`/content-page?cid=${content.id}&mid=${mid}`) : () => {}}
              accessoryRight={
                content.completed ?
                  <MaterialCommunityIcons
                    name='check-bold'
                    size={22 + fontSize}
                    color={colors.green[400]}
                  /> :
                  null
              }
            />
          );
        })}

        <Popup
          visible={visible}
          setVisible={setVisible}
          animationTime={100}
        >
          <Button
            appearance="outline"
            status="info"
            onPress={() => openURL(url1)}
            style={{ marginBottom: 20 }}
          >
            National Cancer Institue
          </Button>
          <Button
            appearance="outline"
            status="info"
            onPress={() => openURL(url2)}
          >
            National Comprehensive Cancer Network
          </Button>
        </Popup>
        <WhiteSpace height={150} />
      </ScrollView>
    </>
  );
}
