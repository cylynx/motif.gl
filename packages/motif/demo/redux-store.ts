import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { investigateReducer } from '../src';

const store = configureStore({
  reducer: combineReducers({
    investigate: investigateReducer,
    // Add other reducers here
  }),
  // Comment off if testing with large data
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
