import type { ModuleState } from '@/src/types/store';
import type { CRCModule } from '@/src/types/crc';
import type { UnknownAction } from '@reduxjs/toolkit';

const initialState: ModuleState = {
  modules: [] as CRCModule[],
};

export default (state: ModuleState = initialState, action: UnknownAction): ModuleState => {
  switch (action.type) {
    case 'UPDATE_MODULES':
      return { ...state, modules: (action as unknown as { value: CRCModule[] }).value };
    case 'CLEAR_MODULES':
      return initialState;
    default:
      return state;
  }
};
