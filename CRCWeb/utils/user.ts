import type { RootState } from '@/src/types/store';
import type { FeatureUser } from '@/src/types/common';

export const isAdmin = (role: string | undefined): boolean => {
  return ['admin', 'superadmin'].includes(role?.toLowerCase() ?? '');
};

export const canEdit = (user: RootState['user']): boolean => {
  if (!user?.user) return false;
  const u = user.user as { featureUsers?: FeatureUser[] };
  return isAdmin(u.featureUsers?.[3]?.role) || user.permissions.some((p) => p.type === 'edit');
};

export const oppositeUser = (role: string): 'user1' | 'user2' => {
  return role === 'user1' ? 'user2' : 'user1';
};

export interface PairedItem {
  user1: unknown;
  user2: unknown;
  user1Status?: string;
  user2Status?: string;
}

export const getCurrentPair = (user: RootState['user']): (PairedItem & { role: string; status?: string }) | null => {
  if (!user?.paired || !Array.isArray(user.paired)) return null;
  for (let i = 0; i < user.paired.length; i++) {
    const paired = user.paired[i] as unknown as PairedItem;
    if (paired.user1 === null && paired.user1Status === 'Confirmed') {
      return {
        ...paired,
        ...(paired.user2 as object),
        role: 'user2',
        status: paired.user2Status,
      } as (PairedItem & { role: string; status?: string });
    }
    if (paired.user2 === null && paired.user2Status === 'Confirmed') {
      return {
        ...paired,
        ...(paired.user1 as object),
        role: 'user1',
        status: paired.user1Status,
      } as (PairedItem & { role: string; status?: string });
    }
  }
  return null;
};

export const getPendingPairs = (user: RootState['user']): unknown[] => {
  if (!user?.paired || !Array.isArray(user.paired)) return [];
  return user.paired.filter((p: unknown) => {
    const paired = p as PairedItem;
    return (
      (paired.user1Status === 'Pending' && paired.user1 === null) ||
      (paired.user2Status === 'Pending' && paired.user2 === null)
    );
  });
};
