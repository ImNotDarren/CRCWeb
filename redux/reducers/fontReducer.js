import fontSizes from "../../theme/fontSizes";

const initialState = {
  fontSize: fontSizes.small,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_FONTSIZE':
      return {
        ...state,
        fontSize: fontSizes[action.value],
      }
      
    default:
      return state;
  }
}