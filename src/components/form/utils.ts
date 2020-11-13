import { NestedFormData } from './NestedForm';
import { SimpleFormData } from './SimpleForm';

/**
 * Utility function to mix in default nested form specs with current options.
 * Initial value is taken from the currentOptions.id and other property are taken from the rest of currentOptions
 *
 * @param {NestedFormData} nestedForm
 * @param {*} currentOptions
 * @param {(data: any) => void} callback
 * @return {*}  {NestedFormData}
 */
export const genNestedForm = (
  nestedForm: NestedFormData,
  currentOptions: any,
  callback: (data: any) => void,
): NestedFormData => {
  const option = nestedForm;
  option.value = currentOptions.id || nestedForm.value;
  option.callback = callback;

  // override value for option if exist in currentOption
  if (option[currentOptions.id]) {
    Object.entries(currentOptions).forEach(([key, value]: any[]) => {
      const idx = option[currentOptions.id].findIndex((x: any) => x.id === key);
      if (idx > -1) {
        option[currentOptions.id][idx].value = value;
      }
    });
  }
  return option;
};

/**
 * Utility function to mix in default simple form specs with current options.
 * currentOptions should be a dict with key given by simpleForm.id
 * e.g. color : "red" if simpleForm.id = "color"
 *
 * @param {SimpleFormData} simpleForm
 * @param {*} currentOptions
 * @param {(data: any) => void} callback
 * @return {*}  {SimpleFormData}
 */
export const genSimpleForm = (
  simpleForm: SimpleFormData,
  currentOptions: any,
  callback: (data: any) => void,
): SimpleFormData => {
  const option = simpleForm;
  option.value = currentOptions[option.id] || simpleForm.value;
  option.callback = callback;
  return option;
};
