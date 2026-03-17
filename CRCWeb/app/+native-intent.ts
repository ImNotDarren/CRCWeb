/**
 * Maps Fitbit OAuth redirect (crcdata://redirect?code=...&state=...) to the correct screen.
 * Cold start: route to /redirect for token exchange before navigating.
 * Warm start: route to fitbit tab; FitbitRedirectListener handles exchange via URL event.
 */
export function redirectSystemPath({
  path,
  initial,
}: {
  path: string | undefined;
  initial: boolean;
}): string | undefined {
  if (!path) return path;
  try {
    const isFitbitRedirect = typeof path === 'string' &&
      ((path.includes('redirect') && path.includes('code=')) ||
       path.startsWith('crcdata://redirect'));
    if (isFitbitRedirect) {
      return initial ? '/redirect' : '/(tabs)/fitbit';
    }
  } catch {
    // ignore
  }
  return path;
}
