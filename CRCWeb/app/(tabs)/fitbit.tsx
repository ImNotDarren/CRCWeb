import FitbitScreen from '@/src/screens/Fitbit';
import { ThemedView } from '@/src/components/ThemedView';

export default function FitbitRoute(): React.ReactElement {
  return (
    <ThemedView style={{ flex: 1 }} colorName="background">
      <FitbitScreen />
    </ThemedView>
  );
}
