import type { UserState } from '@/src/types/store';
import type { UnknownAction } from '@reduxjs/toolkit';
import type { User } from '@/src/types/common';
import type { CRCPermission } from '@/src/types/crc';

const initialState: UserState = {
  user: null,
  permissions: [],
  accessToken: null,
  paired: [],
};

export default (state: UserState = initialState, action: UnknownAction): UserState => {
  switch (action.type) {
    case 'UPDATE_USER':
      return { ...state, user: (action as unknown as { value: User | null }).value };
    case 'UPDATE_PERMISSIONS':
      return { ...state, permissions: (action as unknown as { value: CRCPermission[] }).value };
    case 'UPDATE_ACCESS_TOKEN':
      return { ...state, accessToken: (action as unknown as { value: unknown }).value };
    case 'UPDATE_PAIRED':
      return { ...state, paired: (action as unknown as { value: UserState['paired'] }).value };
    default:
      return state;
  }
};