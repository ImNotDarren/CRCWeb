const initialState = {
  locations: [],
  accelerometers: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_LOCATIONS':
      return {
        ...state,
        locations: action.value,
      }
    case 'ADD_LOCATION':
      return {
        ...state,
        locations: [...state.locations, action.value],
      }
    case 'ADD_LOCATIONS':
      return {
        ...state,
        locations: [...state.locations, ...action.value],
      }
    case 'UPDATE_ACCELEROMETERS':
      return {
        ...state,
        accelerometers: action.value,
      }
    case 'ADD_ACCELEROMETER':
      return {
        ...state,
        accelerometers: [...state.accelerometers, action.value],
      }
    case 'ADD_ACCELEROMETERS':
      return {
        ...state,
        accelerometers: [...state.accelerometers, ...action.value],
      }
    default:
      return state;
  }
}