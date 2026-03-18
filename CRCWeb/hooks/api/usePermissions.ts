import { useState, useCallback, useEffect } from 'react';
import { request } from '@/utils/api';
import type { CRCPermission } from '@/src/types/crc';

export function usePermissionsByUser(userId: number | undefined | null): {
  permissions: CRCPermission[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<CRCPermission[]>;
} {
  const [permissions, setPermissions] = useState<CRCPermission[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async (): Promise<CRCPermission[]> => {
    if (userId == null) return [];
    setLoading(true);
    setError(null);
    try {
      const data = await request<CRCPermission[]>(`/crc/permission/findByUserId/${userId}`);
      const list = Array.isArray(data) ? data : [];
      setPermissions(list);
      return list;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId != null) {
      void refetch();
    } else {
      setPermissions([]);
    }
  }, [userId, refetch]);

  return { permissions, loading, error, refetch };
}

export function useCreatePermission(): {
  createPermission: (type: string, uid: number) => Promise<CRCPermission>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPermission = useCallback(async (type: string, uid: number): Promise<CRCPermission> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<CRCPermission>('/crc/permission/create', {
        method: 'POST',
        body: JSON.stringify({ type, uid }),
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

  return { createPermission, loading, error };
}

export function useDeletePermission(): {
  deletePermission: (pid: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deletePermission = useCallback(async (pid: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await request(`/crc/permission/${pid}`, { method: 'DELETE' });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deletePermission, loading, error };
}
