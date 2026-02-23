import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';

export default function Index() {
  const user = useSelector((state) => state.user.user);
  const currentVersion = useSelector((state) => state.version.currentVersion);

  if (!user?.id) return <Redirect href="/login" />;
  if (!currentVersion?.id) return <Redirect href="/versions" />;
  return <Redirect href="/(tabs)" />;
}
