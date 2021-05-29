import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { investigateReducer } from '@cylynx/motif';

const createStore = () => {
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
  return store
}

export default createStore;
