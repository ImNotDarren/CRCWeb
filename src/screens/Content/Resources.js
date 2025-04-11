import { Text, ScrollView, RefreshControl, View } from "react-native";
import getStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CustomizeMenuItem } from "../../components/CustomizeMenuItem";
import { extractUrl, openURL, removeUrls } from "../../../utils/url";
import WhiteSpace from "../../components/WhiteSpace";
import { Spinner } from "@ui-kitten/components";
import FloatingActionButton from "../../components/FloatingActionButton";
import Config from "react-native-config";

export default function ResourcesScreen({ mid }) {

  
  const dispatch = useDispatch();
  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  const modules = useSelector((state) => state.module.modules);
  const user = useSelector((state) => state.user.user);

  const [module, setModule] = useState(JSON.parse(JSON.stringify(modules.find((m) => m.id === mid))));
  const [refreshing, setRefreshing] = useState(false);

  const getData = () => {
    setRefreshing(true);
    fetch(`${Config.SERVER_URL}/crc/modules/getModuleWebResource/${mid}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        const moduleCopy = JSON.parse(JSON.stringify(module));
        moduleCopy['crcWebResources'] = data;
        setModule(moduleCopy);
        const modulesCopy = JSON.parse(JSON.stringify(modules));
        modulesCopy.find((m) => m.id === mid).crcWebResources = data;
        dispatch({ type: 'UPDATE_MODULES', value: modulesCopy });
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setRefreshing(false);
      });
  }

  useEffect(() => {
    if (module) {
      if (!module.crcWebResources) {
        getData();
      }
    }
  }, [mid, dispatch]);

  const handleNavigate = (url) => () => {
    openURL(url);
  }

  if (!module?.crcWebResources)
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
        {module?.crcWebResources?.map((content, index) => {
          if (extractUrl(content.content))
            return (
              <CustomizeMenuItem
                title={removeUrls(content.content)}
                key={index}
                onNavigate={handleNavigate(extractUrl(content.content))}
              />
            )

          return (
            <Text style={styles.resourcesTitle} key={index}>{content.content}</Text>
          )
        })}
        <WhiteSpace height={150} />
      </ScrollView>
    </>
  );
}