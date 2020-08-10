import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { investigateReducer } from 'motif.gl';

const store = configureStore({
  reducer: combineReducers({
    investigate: investigateReducer,
    // Add other reducers here
  }),
});

export default store;
