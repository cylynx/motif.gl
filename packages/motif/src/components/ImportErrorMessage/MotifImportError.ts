import { ImportError } from './type';

// only can be used by import thunk to display custom error message.
class MotifImportError extends Error {
  constructor(name: ImportError, message = '') {
    super(message);
    this.name = name;
    this.message = message;
  }
}

export default MotifImportError;
