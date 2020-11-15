import NestedForm from './NestedForm';
import SimpleForm from './SimpleForm';

export type { NestedFormData } from './NestedForm';
export type { SimpleFormData } from './SimpleForm';

export { NestedForm, SimpleForm };
export { genSimpleForm, genNestedForm } from './utils';
export default SimpleForm;
