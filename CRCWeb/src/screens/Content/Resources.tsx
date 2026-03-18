import { Text, ScrollView, RefreshControl, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/src/types/store";
import { useEffect, useState } from "react";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import { extractUrl, openURL, removeUrls } from "@/utils/url";
import WhiteSpace from "@/src/components/WhiteSpace";
import { AppSpinner } from "@/src/components/ui";
import { useColors } from "@/hooks/useColors";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

type ResourcesScreenProps = {
  mid: string | string[];
};

export default function ResourcesScreen({ mid }: ResourcesScreenProps): React.ReactElement {
  const dispatch = useDispatch();
  const colors = useColors();
  const fontSize = useSelector((state: RootState) => state.font.fontSize);
  const styles = getStyles(fontSize, colors);
  const modules = useSelector((state: RootState) => state.module.modules);

  const [module, setModule] = useState<Record<string, unknown>>(JSON.parse(JSON.stringify(modules.find((m) => String(m.id) === String(mid)))));
  const [refreshing, setRefreshing] = useState(false);

  const getData = () => {
    setRefreshing(true);
    fetch(`${SERVER_URL}/crc/modules/getModuleWebResource/${mid}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        const moduleCopy = JSON.parse(JSON.stringify(module));
        moduleCopy['crcWebResources'] = data;
        setModule(moduleCopy);
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        const found = modulesCopy.find((m: { id: number }) => String(m.id) === String(mid));
        if (found) found.crcWebResources = data;
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (module) {
      if (!module.crcWebResources) {
        getData();
      }
    }
  }, [mid, dispatch]);

  const handleNavigate = (url: string) => () => {
    openURL(url);
  };

  if (!module?.crcWebResources)
    return (
      <View style={styles.spinnerView}>
        <AppSpinner size="large" />
      </View>
    );

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getData} />}
        style={styles.contentsView}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {(module?.crcWebResources as Array<{ content: string }>)?.map((content, index) => {
          if (extractUrl(content.content))
            return (
              <CustomizeMenuItem
                title={removeUrls(content.content)}
                key={index}
          onNavigate={handleNavigate(extractUrl(content.content) ?? '')}
              />
            );

          return (
            <Text style={styles.resourcesTitle} key={index}>{content.content}</Text>
          );
        })}
        <WhiteSpace height={150} />
      </ScrollView>
    </>
  );
}
