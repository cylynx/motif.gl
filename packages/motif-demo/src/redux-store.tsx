import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { investigateReducer } from '@cylynx/motif';

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
