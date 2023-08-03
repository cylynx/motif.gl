import { configureStore, combineReducers } from '@reduxjs/toolkit';
import investigateReducer from './investigate/slice';

const store = configureStore({
  reducer: combineReducers({
    investigate: investigateReducer,
    // Add other reducers here
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
