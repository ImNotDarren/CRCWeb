import { useState, useCallback } from 'react';
import { request } from '@/utils/api';
import type { CRCModule } from '@/src/types/crc';
import type { CRCModuleProgress } from '@/src/types/crc';

export interface GetModuleByRoleParams {
  uid: number;
  role: string;
  vid: number;
}

export function useModulesByRole(params: GetModuleByRoleParams | null): {
  modules: CRCModule[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<CRCModule[]>;
} {
  const [modules, setModules] = useState<CRCModule[]>([]);
  const [loading, setLoading] = useState(Boolean(params?.uid && params?.vid));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async (): Promise<CRCModule[]> => {
    if (!params?.uid || !params.vid) return [];
    setLoading(true);
    setError(null);
    try {
      const data = await request<CRCModule[] | { modules?: CRCModule[] }>(
        '/crc/modules/getModuleByRole',
        {
          method: 'POST',
          body: JSON.stringify({
            uid: params.uid,
            role: params.role.toLowerCase(),
            vid: params.vid,
          }),
        }
      );
      const list = Array.isArray(data) ? data : (data?.modules ?? []);
      setModules(list);
      return list;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    } finally {
      setLoading(false);
    }
  }, [params?.uid, params?.role, params?.vid]);

  return { modules, loading, error, refetch };
}

export function useSetModuleProgress(): {
  setProgress: (mid: string | string[], uid: number | undefined, progress: number) => Promise<CRCModuleProgress | { message?: string }>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setProgress = useCallback(
    async (
      mid: string | string[],
      uid: number | undefined,
      progress: number
    ): Promise<CRCModuleProgress | { message?: string }> => {
      setLoading(true);
      setError(null);
      try {
        const data = await request<CRCModuleProgress | { message?: string }>(
          '/crc/modules/setProgress',
          {
            method: 'POST',
            body: JSON.stringify({ mid, uid, progress }),
          }
        );
        return data;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { setProgress, loading, error };
}

export function useModuleWebResource(mid: string | string[] | undefined): {
  data: unknown[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(Boolean(mid));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!mid) return;
    setLoading(true);
    setError(null);
    try {
      const res = await request<unknown[]>(`/crc/modules/getModuleWebResource/${mid}`);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [mid]);

  return { data, loading, error, refetch };
}

export function useModuleLecture(mid: string | string[] | undefined): {
  data: unknown[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(Boolean(mid));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!mid) return;
    setLoading(true);
    setError(null);
    try {
      const res = await request<unknown[]>(`/crc/modules/getModuleLecture/${mid}`);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [mid]);

  return { data, loading, error, refetch };
}

export function useModuleAssignment(
  mid: string | string[] | undefined,
  userId: number | undefined
): {
  data: unknown[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(Boolean(mid && userId));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!mid || userId == null) return;
    setLoading(true);
    setError(null);
    try {
      const res = await request<unknown[]>(`/crc/modules/getModuleAssignment/${mid}/${userId}`);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [mid, userId]);

  return { data, loading, error, refetch };
}

export function useModuleContent(mid: string | string[] | undefined): {
  data: unknown[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(Boolean(mid));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!mid) return;
    setLoading(true);
    setError(null);
    try {
      const res = await request<unknown[]>(`/crc/modules/getModuleContent/${mid}`);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [mid]);

  return { data, loading, error, refetch };
}
