import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import fontReducer from './reducers/fontReducer';
import moduleReducer from './reducers/moduleReducer';
import activityReducer from './reducers/activityReducer';
import versionReducer from './reducers/versionReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    font: fontReducer,
    module: moduleReducer,
    activity: activityReducer,
    version: versionReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
