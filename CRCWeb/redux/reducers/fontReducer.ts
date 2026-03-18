import fontSizes from '@/theme/fontSizes';
import type { FontState } from '@/src/types/store';
import type { FontSizeKey } from '@/src/types/crc';
import type { UnknownAction } from '@reduxjs/toolkit';

const initialState: FontState = {
  fontSize: fontSizes.small,
};

export default (state: FontState = initialState, action: UnknownAction): FontState => {
  switch (action.type) {
    case 'UPDATE_FONTSIZE':
      return { ...state, fontSize: fontSizes[(action as unknown as { value: FontSizeKey }).value] };
    default:
      return state;
  }
};
