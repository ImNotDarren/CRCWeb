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
    default:
      return state;
  }
};