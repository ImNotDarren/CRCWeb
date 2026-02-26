import MeScreen from '@/src/screens/Me';
import { ThemedView } from '@/src/components/ThemedView';

export default function MeRoute(): React.ReactElement {
  return (
    <ThemedView style={{ flex: 1 }} colorName="background">
      <MeScreen />
    </ThemedView>
  );
}
