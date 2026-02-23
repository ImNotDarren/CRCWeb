import { useState, useCallback, useEffect } from 'react';
import { request } from '@/utils/api';

export interface FeatureUserRow {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  [key: string]: unknown;
}

export function useFeatureUsers(featureId: number): {
  users: FeatureUserRow[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [users, setUsers] = useState<FeatureUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<FeatureUserRow[]>(`/feature/${featureId}/users`);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [featureId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { users, loading, error, refetch };
}
