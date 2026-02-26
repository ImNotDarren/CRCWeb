import React from 'react';
import EditScreen from '@/src/screens/Content/EditScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';

function paramString(p: string | string[] | undefined): string {
  if (p == null) return '';
  return Array.isArray(p) ? p[0] ?? '' : p;
}

export default function EditRoute(): React.ReactElement {
  const params = useLocalSearchParams<{ type?: string | string[]; mid?: string | string[] }>();
  const router = useRouter();
  const type = paramString(params.type);
  const mid = paramString(params.mid);

  return <EditScreen screen={type} mid={mid} router={router} />;
}
