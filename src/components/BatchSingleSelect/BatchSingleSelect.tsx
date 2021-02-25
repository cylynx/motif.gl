import React, { FC, useEffect } from 'react';
import {
  OnChangeParams,
  Select,
  SelectOverrides,
  TYPE,
  Value,
  SIZE,
} from 'baseui/select';
import VirtualDropdown from './VirtualDropdown';

export type BatchSingleSelectProps = {
  options: Value;
  onChange: (params: OnChangeParams) => any;
  value: Value;
  labelKey?: string;
  valueKey?: string;
  placeholder?: string;
  overrides?: SelectOverrides;
  type?: TYPE[keyof TYPE];
  size?: SIZE[keyof SIZE];
  maxDropdownHeight?: string;
  clearable?: boolean;
  [x: string]: any;
};
const BatchSingleSelect: FC<BatchSingleSelectProps> = ({
  options,
  onChange,
  value,
  labelKey,
  valueKey,
  overrides = {},
  placeholder,
  clearable,
  size = 'compact',
  type = TYPE.search,
  maxDropdownHeight = '300px',
  ...rest
}) => {
  useEffect(() => {
    Object.assign(overrides, {
      Dropdown: VirtualDropdown,
    });
  }, [overrides]);

  return (
    <Select
      options={options}
      labelKey={labelKey}
      valueKey={valueKey}
      placeholder={placeholder}
      overrides={overrides}
      onChange={onChange}
      value={value}
      size={size}
      type={type}
      maxDropdownHeight={maxDropdownHeight}
      clearable={clearable}
      {...rest}
    />
  );
};

export default BatchSingleSelect;
