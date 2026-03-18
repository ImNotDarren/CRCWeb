import { useState, useCallback } from 'react';
import { request } from '@/utils/api';
import type { CRCLocation } from '@/src/types/crc';

export function useLocationsByUser(userId: number | undefined | null): {
  locations: CRCLocation[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [locations, setLocations] = useState<CRCLocation[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (userId == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await request<CRCLocation[]>(`/crc/locations/findAllByUserId/${userId}`);
      setLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { locations, loading, error, refetch };
}

export interface BulkCreateLocationsBody {
  locations: Array<{
    timestamp: number;
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    speed: number;
    userId: number;
  }>;
}

export function useBulkCreateLocations(): {
  bulkCreate: (body: BulkCreateLocationsBody) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkCreate = useCallback(async (body: BulkCreateLocationsBody): Promise<unknown> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<unknown>('/crc/locations/bulkCreate', {
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

  return { bulkCreate, loading, error };
}

export interface BulkCreateAccelerometersBody {
  accelerometers: Array<Record<string, unknown>>;
}

export function useBulkCreateAccelerometers(): {
  bulkCreate: (body: BulkCreateAccelerometersBody) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkCreate = useCallback(async (body: BulkCreateAccelerometersBody): Promise<unknown> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<unknown>('/crc/accelerometers/bulkCreate', {
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

  return { bulkCreate, loading, error };
}
