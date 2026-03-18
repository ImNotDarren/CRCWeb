import type { VersionState } from '@/src/types/store';
import type { UnknownAction } from '@reduxjs/toolkit';

const initialState: VersionState = {
  versions: [],
  currentVersion: { id: 1, name: 'CRCWeb', description: 'CRCWeb main version' },
};

export default (state: VersionState = initialState, action: UnknownAction): VersionState => {
  switch (action.type) {
    case 'UPDATE_VERSIONS':
      return { ...state, versions: (action as unknown as { value: VersionState['versions'] }).value };
    case 'UPDATE_CURRENT_VERSION':
      return { ...state, currentVersion: (action as unknown as { value: VersionState['currentVersion'] }).value };
    default:
      return state;
  }
};
