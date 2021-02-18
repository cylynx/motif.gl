import { OnChangeParams, Value } from 'baseui/select';

export type SingleStringSelectProps = {
  options: Value;
  labelKey: string;
  valueKey: string;
  onChange: (params: OnChangeParams) => any;
  value: Value;
  placeholder?: string;
};
