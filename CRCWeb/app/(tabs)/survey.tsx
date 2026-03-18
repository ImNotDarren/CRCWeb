import SurveyScreen from '@/src/screens/Survey';
import { ThemedView } from '@/src/components/ThemedView';

export default function SurveyRoute(): React.ReactElement {
  return (
    <ThemedView style={{ flex: 1 }} colorName="background">
      <SurveyScreen />
    </ThemedView>
  );
}
