import { useState, useCallback, useEffect } from 'react';
import { request } from '@/utils/api';

export interface LogFindBody {
  condition: {
    action: string;
    target: string;
    userId: number | undefined;
  };
}

export function useLogFind(): {
  find: (body: LogFindBody) => Promise<unknown[]>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const find = useCallback(async (body: LogFindBody): Promise<unknown[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<unknown[]>('/log/find/', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return Array.isArray(data) ? data : [];
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { find, loading, error };
}

export interface LogCreateBody {
  action: string;
  target: string;
  userId: number | undefined;
  [key: string]: unknown;
}

export function useLogCreate(): {
  create: (body: LogCreateBody) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (body: LogCreateBody): Promise<unknown> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<unknown>('/log/create', {
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

  return { create, loading, error };
}

export function useLogsByUserId(userId: number | undefined | null): {
  logs: unknown[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [logs, setLogs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (userId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await request<unknown[]>(`/log/findByUserId/${userId}`);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId != null) {
      void refetch();
    } else {
      setLogs([]);
    }
  }, [userId, refetch]);

  return { logs, loading, error, refetch };
}
