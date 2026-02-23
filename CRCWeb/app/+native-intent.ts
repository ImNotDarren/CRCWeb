/**
 * Maps Fitbit OAuth redirect (crcdata://redirect?code=...&state=...) to /redirect
 * so the app opens the redirect screen and completes the token exchange.
 */
export function redirectSystemPath({
  path,
  initial,
}: {
  path: string | undefined;
  initial: boolean;
}): string | undefined {
  if (!initial || !path) return path;
  try {
    if (typeof path === 'string' && path.includes('redirect') && path.includes('code=')) {
      return '/redirect';
    }
    if (typeof path === 'string' && path.startsWith('crcdata://redirect')) {
      return '/redirect';
    }
  } catch {
    // ignore
  }
  return path;
}
