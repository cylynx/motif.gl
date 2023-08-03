import React, { FC, useEffect } from 'react';
import {
  OnChangeParams,
  SelectOverrides,
  TYPE,
  Value,
  SIZE,
} from 'baseui/select';
import * as Icons from '../Icons';
import VirtualDropdown from './VirtualDropdown';
import { Dropdown } from '../ui';

const SelectFieldPopoverOverride = {
  props: {
    overrides: {
      Body: {
        style: () => ({ zIndex: 1 }),
      },
    },
  },
};

const SearchIconOverride = {
  props: {
    overrides: {
      component: () => <Icons.Search />,
    },
  },
};

export type BatchSingleSelectProps = {
  options: Value;
  onChange: (params: OnChangeParams) => any;
  value: Value;
  labelKey?: string;
  valueKey?: string;
  placeholder?: string;
  overrides?: SelectOverrides;
  type?: (typeof TYPE)[keyof typeof TYPE];
  size?: (typeof SIZE)[keyof typeof SIZE];
  maxDropdownHeight?: string;
  clearable?: boolean;
  multi?: boolean;
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
  multi = false,
  ...rest
}) => {
  useEffect(() => {
    Object.assign(overrides, {
      Dropdown: VirtualDropdown,
      Popover: SelectFieldPopoverOverride,
      SearchIcon: SearchIconOverride,
    });
  }, [overrides]);

  return (
    <Dropdown
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
      multi={multi}
      {...rest}
    />
  );
};

export default BatchSingleSelect;
