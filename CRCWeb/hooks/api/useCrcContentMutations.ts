import { useState, useCallback } from 'react';
import { request } from '@/utils/api';

/** Generic update/create/remove helpers for CRC content endpoints. */

export function useCrcModuleContentsUpdate(): {
  update: (id: number, content: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const update = useCallback(async (id: number, content: string) => {
    setLoading(true);
    setError(null);
    try {
      await request('/crc/moduleContents/updateContent', {
        method: 'POST',
        body: JSON.stringify({ id, content }),
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { update, loading, error };
}

export function useCrcModuleContentsCreate(): {
  create: (mid: number, content: string) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const create = useCallback(async (mid: number, content: string) => {
    setLoading(true);
    setError(null);
    try {
      return await request<unknown>('/crc/moduleContents/create', {
        method: 'POST',
        body: JSON.stringify({ mid, content }),
      });
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

export function useCrcModuleContentsRemove(): {
  remove: (id: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const remove = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await request('/crc/moduleContents/remove', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { remove, loading, error };
}

export function useCrcModuleAssignmentsUpdate(): {
  update: (id: number, content: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const update = useCallback(async (id: number, content: string) => {
    setLoading(true);
    setError(null);
    try {
      await request('/crc/moduleAssignments/updateContent', {
        method: 'POST',
        body: JSON.stringify({ id, content }),
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { update, loading, error };
}

export function useCrcModuleAssignmentsCreate(): {
  create: (mid: number, content: string) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const create = useCallback(async (mid: number, content: string) => {
    setLoading(true);
    setError(null);
    try {
      return await request<unknown>('/crc/moduleAssignments/create', {
        method: 'POST',
        body: JSON.stringify({ mid, content }),
      });
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

export function useCrcModuleAssignmentsRemove(): {
  remove: (id: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const remove = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await request('/crc/moduleAssignments/remove', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { remove, loading, error };
}

export function useCrcWebResourcesUpdate(): {
  update: (id: number, content: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const update = useCallback(async (id: number, content: string) => {
    setLoading(true);
    setError(null);
    try {
      await request('/crc/webresources/updateContent', {
        method: 'POST',
        body: JSON.stringify({ id, content }),
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { update, loading, error };
}

export function useCrcWebResourcesCreate(): {
  create: (mid: number, content: string) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const create = useCallback(async (mid: number, content: string) => {
    setLoading(true);
    setError(null);
    try {
      return await request<unknown>('/crc/webresources/create', {
        method: 'POST',
        body: JSON.stringify({ mid, content }),
      });
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

export function useCrcWebResourcesRemove(): {
  remove: (id: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const remove = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await request('/crc/webresources/remove', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { remove, loading, error };
}

export function useCrcLecturesUpdate(): {
  update: (body: { id: number; title?: string; link?: string; transcript?: string | null; note?: string | null }) => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const update = useCallback(
    async (body: {
      id: number;
      title?: string;
      link?: string;
      transcript?: string | null;
      note?: string | null;
    }) => {
      setLoading(true);
      setError(null);
      try {
        await request('/crc/lectures/update', {
          method: 'POST',
          body: JSON.stringify(body),
        });
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
  return { update, loading, error };
}

export function useCrcContentPagesUpdate(): {
  update: (body: { cid: string; title: string; content: string }) => Promise<{ message?: string }>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const update = useCallback(async (body: { cid: string; title: string; content: string }) => {
    setLoading(true);
    setError(null);
    try {
      return await request<{ message?: string }>('/crc/contentpages/update', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { update, loading, error };
}

export function useCrcContentPagesCreate(): {
  create: (body: { cid: string; title: string; content: string }) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const create = useCallback(async (body: { cid: string; title: string; content: string }) => {
    setLoading(true);
    setError(null);
    try {
      return await request<unknown>('/crc/contentpages/create', {
        method: 'POST',
        body: JSON.stringify(body),
      });
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

export function useCrcAssignmentContentsUpdate(): {
  update: (body: { aid: string; title: string; content: string }) => Promise<{ message?: string }>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const update = useCallback(async (body: { aid: string; title: string; content: string }) => {
    setLoading(true);
    setError(null);
    try {
      return await request<{ message?: string }>('/crc/assignmentcontents/update', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);
  return { update, loading, error };
}

export function useCrcAssignmentContentsCreate(): {
  create: (body: { cid: string; title: string; content: string }) => Promise<void>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const create = useCallback(async (body: { cid: string; title: string; content: string }) => {
    setLoading(true);
    setError(null);
    try {
      await request('/crc/assignmentcontents/create', {
        method: 'POST',
        body: JSON.stringify(body),
      });
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

export function useCrcAssignmentContentsCreateUser(): {
  createUserAssignmentContent: (body: {
    userId: number;
    cacId: number;
    value: boolean;
    details?: string | null;
  }) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const createUserAssignmentContent = useCallback(
    async (body: {
      userId: number;
      cacId: number;
      value: boolean;
      details?: string | null;
    }) => {
      setLoading(true);
      setError(null);
      try {
        return await request<unknown>('/crc/assignmentcontents/createUserAssignmentContent', {
          method: 'POST',
          body: JSON.stringify(body),
        });
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
  return { createUserAssignmentContent, loading, error };
}

export function useCrcMultipleChoicesByModule(mid: string | string[] | undefined): {
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
      const res = await request<unknown[]>(`/crc/multiplechoices/findByModuleId/${mid}`);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [mid]);
  return { data, loading, error, refetch };
}

export function useCrcMultipleChoicesRecordScore(): {
  recordScore: (body: { mid: string | string[]; uid: number; score: number }) => Promise<unknown>;
  loading: boolean;
  error: Error | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const recordScore = useCallback(
    async (body: { mid: string | string[]; uid: number; score: number }) => {
      setLoading(true);
      setError(null);
      try {
        return await request<unknown>('/crc/multiplechoices/recordScore', {
          method: 'POST',
          body: JSON.stringify(body),
        });
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
  return { recordScore, loading, error };
}
