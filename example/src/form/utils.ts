/* eslint-disable no-param-reassign */
import set from 'lodash/set';
import { produce } from 'immer';
import { NestedFormData } from './NestedForm';
import { SimpleFormData } from './SimpleForm';

/**
 *
 * @param {NestedFormData} nestedForm
 * @param {*} currentOptions
 * @param {(data: any) => void} callback
 * @return {*}  {NestedFormData}
 */

/**
 * Utility function to mix in default nested form specs with current options.
 * Initial value is taken from the currentOptions.id and other property are taken from the rest of currentOptions
 *
 * @param {NestedFormData} nestedForm
 * @param {*} currentOptions
 * @param {(data: any) => void} callback
 * @param {*} [override] key-value pair to override. key can be string which is accessed using lodash get.
 * @return {*}  {NestedFormData}
 */
export const genNestedForm = (
  nestedForm: NestedFormData,
  currentOptions: any,
  callback: (data: any) => void,
  override?: any,
): NestedFormData => {
  const newForm = produce(nestedForm, (option) => {
    const details = currentOptions[nestedForm.id];
    option.value = details?.id || nestedForm.value;
    option.callback = callback;

    // override value for option if exist in currentOption
    if (option[details?.id]) {
      Object.entries(details).forEach(([key, value]: any[]) => {
        const idx = option[details.id].findIndex((x: any) => x.id === key);
        if (idx > -1) {
          option[details.id][idx].value = value;
        }
      });
    }
    // manual override
    if (override) {
      Object.entries(override).forEach(([key, value]: any[]) => {
        set(option, key, value);
      });
    }
  });

  return newForm;
};

/**
 * Utility function to mix in default simple form specs with current options.
 * currentOptions should be a dict with key given by simpleForm.id
 * e.g. color : "red" if simpleForm.id = "color"
 *
 * @param {SimpleFormData} simpleForm
 * @param {*} currentOptions
 * @param {(data: any) => void} callback
 * @param {*} [override] key-value pair to override. key can be string which is accessed using lodash get.
 * @return {*}  {SimpleFormData}
 */
export const genSimpleForm = (
  simpleForm: SimpleFormData,
  currentOptions: any,
  callback: (data: any) => void,
  override?: any,
): SimpleFormData => {
  const newForm = produce(simpleForm, (option) => {
    option.value = currentOptions[option.id] || simpleForm.value;
    option.callback = callback;
    if (override) {
      Object.entries(override).forEach(([key, value]: any[]) => {
        set(option, key, value);
      });
    }
  });
  return newForm;
};
