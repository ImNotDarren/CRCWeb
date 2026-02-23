import { Text, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { isAdmin } from '@/utils/user';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { alert } from '@/utils/alert';
import type { RootState } from '@/src/types/store';
import type { CRCVersion } from '@/src/types/crc';
import { useVersions } from '@/hooks/api';
import { ThemedView } from '@/src/components/ThemedView';
import versionSelectionStyles from './VersionSelectionStyle';

export default function VersionSelection(): React.ReactElement {
  const router = useRouter();
  const styles = versionSelectionStyles;
  const versions = useSelector((state: RootState) => state.version.versions);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const { versions: fetchedVersions, loading, error, refetch } = useVersions();

  const handleSelect = (version: CRCVersion): void => {
    dispatch({ type: 'UPDATE_CURRENT_VERSION', value: version });
    router.replace('/(tabs)');
  };

  useEffect(() => {
    dispatch({ type: 'CLEAR_MODULES' });
  }, [dispatch]);

  useEffect(() => {
    if (versions.length === 0) {
      void refetch();
    }
  }, [refetch, versions.length]);

  useEffect(() => {
    if (fetchedVersions.length > 0) {
      dispatch({ type: 'UPDATE_VERSIONS', value: fetchedVersions });
      if (versions.length === 0) {
        dispatch({ type: 'UPDATE_CURRENT_VERSION', value: fetchedVersions[0] });
      }
    }
  }, [fetchedVersions, dispatch, versions.length]);

  useEffect(() => {
    if (error) {
      alert('Error', 'Failed to fetch versions. Please try again later.');
    }
  }, [error]);

  const userWithFeatures = user as (typeof user) & { featureUsers?: Array<{ role?: string }> };

  return (
    <ThemedView style={styles.grid}>
      {versions.map((v) => (
        <TouchableOpacity
          activeOpacity={0.8}
          key={v.id}
          style={styles.cell}
          onPress={() => handleSelect(v)}
        >
          <Text style={styles.cellTitle}>{v.name}</Text>
          <Text style={styles.cellText}>{v.description ?? ''}</Text>
        </TouchableOpacity>
      ))}
      {isAdmin(userWithFeatures?.featureUsers?.[4]?.role) && (
        <TouchableOpacity activeOpacity={0.8} style={styles.addCell}>
          <MaterialCommunityIcons name="plus" color="#a3a3a3" size={40} />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}
