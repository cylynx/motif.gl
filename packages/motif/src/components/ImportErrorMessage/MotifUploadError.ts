import { UploadError } from './type';

// only can be used by import thunk to display custom error message.
class MotifUploadError extends Error {
  constructor(name: UploadError[keyof UploadError], message = '') {
    super(message);
    this.name = name as unknown as string;
    this.message = message;
  }
}

export default MotifUploadError;
