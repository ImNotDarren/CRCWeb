import { useState, useCallback } from 'react';
import { request } from '@/utils/api';
import type { User } from '@/src/types/common';

export interface LoginParams {
  username: string;
  password: string;
}

export type LoginResult = User | { message: string };

export function useLogin(): {
  login: (params: LoginParams) => Promise<LoginResult>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (params: LoginParams): Promise<LoginResult> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<LoginResult>('/auth/login', {
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

  return { login, loading, error };
}
