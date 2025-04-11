import { ScrollView } from "react-native";
import getStyles from "./style";
import { useSelector } from "react-redux";
import { CustomizeMenuItem } from "../../components/CustomizeMenuItem";
import { openURL } from "../../../utils/url";

export default function SurveyScreen({ navigation }) {

  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);

  const surveys = [
    {
      title: "Before Survey",
      url: "https://redcap.emory.edu/surveys/?s=X7PEFN8NKT9NJN7N",
    },
    {
      title: "After Survey",
      url: "https://redcap.emory.edu/surveys/?s=8FHH87R7LPY8Y3W3",
    },
    {
      title: "Weekly Check-in",
      url: "https://survey.qualtrics.emory.edu/jfe/form/SV_5p6tR77GBQU8CV0",
    },
    {
      title: "Consent Form",
      url: "https://redcap.emory.edu/surveys/?s=ECXR4KDP3W8YP94C",
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {surveys.map((survey, index) => (
        <CustomizeMenuItem
          key={index}
          title={survey.title}
          onNavigate={survey.url ? () => openURL(survey.url) : null}
        />
      ))}
    </ScrollView>
  );
}