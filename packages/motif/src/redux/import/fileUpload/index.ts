import reducer, { initialState } from './slice';

// eslint-disable-next-line prettier/prettier
export * as FileUploadSlices from './slice';
export * as FileUploadSelectors from './selectors';
export * from './types';
export * as FileUploadThunks from './thunk';
export { initialState };
export default reducer;
