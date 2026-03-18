import HomeScreen from '@/src/screens/Home';
import { ThemedView } from '@/src/components/ThemedView';

export default function HomeRoute(): React.ReactElement {
  return (
    <ThemedView style={{ flex: 1 }} colorName="background">
      <HomeScreen />
    </ThemedView>
  );
}
