const initialState = {
  user: null,
  permissions: [],
  accessToken: null,
  paired: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.value,
      }
    case 'UPDATE_PERMISSIONS':
      return {
        ...state,
        permissions: action.value,
      }
    case 'UPDATE_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.value,
      }
    case 'UPDATE_PAIRED':
      return {
        ...state,
        paired: action.value,
      }
    default:
      return state;
  }
};