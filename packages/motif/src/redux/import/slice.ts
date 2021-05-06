import { combineReducers } from '@reduxjs/toolkit';
import fileUploadReducer from './fileUpload/slice';

const importReducer = combineReducers({
  fileUpload: fileUploadReducer,
});

export default importReducer;
