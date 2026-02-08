const initialState = {
  modules: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_MODULES':
      return {
        ...state,
        modules: action.value,
      }
    case 'CLEAR_MODULES':
      return initialState;
    default:
      return state;
  }
};