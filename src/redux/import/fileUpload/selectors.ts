import { TFileContentState } from './types';

const getFileUpload = (state: any): TFileContentState =>
  state.investigate.import.fileUpload;

export { getFileUpload };
