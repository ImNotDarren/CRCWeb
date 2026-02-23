import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/src/types/store';

export default function Index(): React.ReactElement {
  const user = useSelector((state: RootState) => state.user.user);
  const currentVersion = useSelector((state: RootState) => state.version.currentVersion);

  if (!user?.id) return <Redirect href="/login" />;
  if (!currentVersion?.id) return <Redirect href="/versions" />;
  return <Redirect href="/(tabs)" />;
}
