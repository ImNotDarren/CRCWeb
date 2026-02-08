const initialState = {
  versions: [],
  currentVersion: { id: 1, name: "CRCWeb", description: "CRCWeb main version" },
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_VERSIONS':
      return {
        ...state,
        versions: action.value,
      }
    case 'UPDATE_CURRENT_VERSION':
      return {
        ...state,
        currentVersion: action.value,
      }
    default:
      return state;
  }
};