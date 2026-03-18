import type { ActivityState } from '@/src/types/store';
import type { UnknownAction } from '@reduxjs/toolkit';
import type { CRCLocation, CRCAccelerometer } from '@/src/types/crc';

const initialState: ActivityState = {
  locations: [],
  accelerometers: [],
};

export default (state: ActivityState = initialState, action: UnknownAction): ActivityState => {
  switch (action.type) {
    case 'UPDATE_LOCATIONS':
      return { ...state, locations: (action as unknown as { value: CRCLocation[] }).value };
    case 'ADD_LOCATION':
      return { ...state, locations: [...state.locations, (action as unknown as { value: CRCLocation }).value] };
    case 'ADD_LOCATIONS':
      return { ...state, locations: [...state.locations, ...(action as unknown as { value: CRCLocation[] }).value] };
    case 'UPDATE_ACCELEROMETERS':
      return { ...state, accelerometers: (action as unknown as { value: CRCAccelerometer[] }).value };
    case 'ADD_ACCELEROMETER':
      return { ...state, accelerometers: [...state.accelerometers, (action as unknown as { value: CRCAccelerometer }).value] };
    case 'ADD_ACCELEROMETERS':
      return { ...state, accelerometers: [...state.accelerometers, ...(action as unknown as { value: CRCAccelerometer[] }).value] };
    default:
      return state;
  }
};
