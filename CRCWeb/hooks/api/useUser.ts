import { useState, useCallback, useEffect } from 'react';
import { request } from '@/utils/api';

export interface SearchUser {
  id: number;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  featureUsers?: Array<{ role: string }>;
}

export interface UserSearchParams {
  fid: number;
  attributes: string[];
  limit: number;
  searchString: string;
  status: string;
  exUids: number[];
}

export function useUserSearch(): {
  search: (params: UserSearchParams) => Promise<SearchUser[]>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (params: UserSearchParams): Promise<SearchUser[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<SearchUser[]>('/user/search', {
        method: 'POST',
        body: JSON.stringify(params),
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

  return { search, loading, error };
}

export function useUserById(userId: number | string | undefined | null): {
  user: Record<string, unknown> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<Record<string, unknown> | null>;
} {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async (): Promise<Record<string, unknown> | null> => {
    if (userId == null || userId === '') return null;
    setLoading(true);
    setError(null);
    try {
      const data = await request<Record<string, unknown>>(`/user/${userId}`);
      setUser(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId != null && userId !== '') {
      void refetch();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [userId, refetch]);

  return { user, loading, error, refetch };
}

export interface CreateUserBody {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  fid: number;
  role: string;
}

export interface CreateUserBody {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  fid: number;
  role: string;
}

/** Create user for admin (feature user) - no password, includes status etc. */
export interface CreateFeatureUserBody {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  loginType: string;
  isBot: string;
  fid: number;
  role: string;
  status: string;
}

export function useCreateFeatureUser(): {
  createUser: (body: CreateFeatureUserBody) => Promise<Record<string, unknown> & { error?: string; err?: { message: string }; message?: string; success?: boolean }>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createUser = useCallback(
    async (
      body: CreateFeatureUserBody
    ): Promise<Record<string, unknown> & { error?: string; err?: { message: string }; message?: string; success?: boolean }> => {
      setLoading(true);
      setError(null);
      try {
        const data = await request<
          Record<string, unknown> & { error?: string; err?: { message: string }; message?: string; success?: boolean }
        >('/user/', {
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
    },
    []
  );

  return { createUser, loading, error };
}

export function useCreateUser(): {
  createUser: (body: CreateUserBody) => Promise<Record<string, unknown>>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createUser = useCallback(async (body: CreateUserBody): Promise<Record<string, unknown>> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<Record<string, unknown>>('/user/', {
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

  return { createUser, loading, error };
}
