import ContentScreen from '@/src/screens/Content';
import { ThemedView } from '@/src/components/ThemedView';

export default function ContentRoute(): React.ReactElement {
  return (
    <ThemedView style={{ flex: 1 }} colorName="background">
      <ContentScreen />
    </ThemedView>
  );
}
