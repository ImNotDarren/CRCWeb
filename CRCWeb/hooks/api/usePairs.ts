import { useState, useCallback } from 'react';
import { request } from '@/utils/api';

export function usePairsByUser(userId: number | undefined | null): {
  data: unknown[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown[]>;
} {
  const [data, setData] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async (): Promise<unknown[]> => {
    if (userId == null) return [];
    setLoading(true);
    setError(null);
    try {
      const res = await request<{ message?: string } | unknown[]>(
        `/pairs/user/${userId}/feature/3`
      );
      const list = Array.isArray(res) && (res as { message?: string }[])[0]?.message ? [] : (Array.isArray(res) ? res : []);
      setData(list);
      return list;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { data, loading, error, refetch };
}

export interface CreatePairBody {
  user1Id: number | undefined;
  user2Id: number;
  user1Status: string;
  user2Status: string;
  fid: number;
}

export function useCreatePair(): {
  createPair: (body: CreatePairBody) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPair = useCallback(async (body: CreatePairBody): Promise<unknown> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<unknown>('/pairs/create', {
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

  return { createPair, loading, error };
}

export interface DeletePairBody {
  [key: string]: number | undefined;
  fid: number;
}

export function useDeletePair(): {
  deletePair: (body: DeletePairBody) => Promise<{ message?: string }>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deletePair = useCallback(async (body: DeletePairBody): Promise<{ message?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<{ message?: string }>('/pairs/delete', {
        method: 'DELETE',
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

  return { deletePair, loading, error };
}
