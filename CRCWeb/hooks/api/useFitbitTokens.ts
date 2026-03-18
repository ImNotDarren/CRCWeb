import { useState, useCallback } from 'react';
import { request } from '@/utils/api';

export function useFitbitAccessToken(userId: number | undefined | null): {
  token: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (userId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await request<{ token?: string }>(`/cbw/accesstokens/${userId}`);
      setToken(data?.token ?? null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { token, loading, error, refetch };
}

export interface SaveFitbitAccessTokenBody {
  uid: number;
  token: string;
}

export function useSaveFitbitAccessToken(): {
  saveToken: (body: SaveFitbitAccessTokenBody) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveToken = useCallback(async (body: SaveFitbitAccessTokenBody): Promise<unknown> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<unknown>('/cbw/accesstokens', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return data;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { saveToken, loading, error };
}
