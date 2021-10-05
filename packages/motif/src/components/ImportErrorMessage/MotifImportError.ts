import { ImportError } from './type';

// only can be used by import thunk to display custom error message.
class MotifImportError extends Error {
  constructor(name: ImportError[keyof ImportError], message = '') {
    super(message);
    this.name = name as unknown as string;
    this.message = message;
  }
}

export default MotifImportError;
