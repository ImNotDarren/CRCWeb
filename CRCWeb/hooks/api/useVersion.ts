import { useState, useCallback } from 'react';
import { request } from '@/utils/api';
import type { CRCVersion } from '@/src/types/crc';

export function useVersions(): {
  versions: CRCVersion[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [versions, setVersions] = useState<CRCVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<CRCVersion[]>('/crc/version');
      setVersions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { versions, loading, error, refetch };
}
