/**
 * Base API client. All API calls should go through hooks that use getServerUrl() or request().
 */
export function getServerUrl(): string {
  return process.env.EXPO_PUBLIC_SERVER_URL || '';
}

export type RequestInit = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
};

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = getServerUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...(options.body != null && { body: options.body }),
  });
  const text = await res.text();
  let data: T;
  try {
    data = (text ? JSON.parse(text) : {}) as T;
  } catch {
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    throw new Error('Invalid JSON response');
  }
  if (!res.ok) {
    throw new Error((data as { message?: string })?.message ?? `Request failed: ${res.status}`);
  }
  return data;
}
