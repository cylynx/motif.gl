import React, { FC } from 'react';
import { Theme } from 'baseui/theme';
import {
  OnChangeParams,
  Select,
  Value,
  TYPE,
  SelectOverrides,
} from 'baseui/select';

type MultiStringSelectType = {
  placeholder: string;
  onChange?: (params: Value) => void;
  value: Value;
  options: Value;
  overrides?: SelectOverrides;
};

const MultiStringSelect: FC<MultiStringSelectType> = ({
  placeholder,
  value,
  options,
  onChange,
  overrides,
}) => {
  return (
    <Select
      placeholder={placeholder}
      options={options}
      onChange={(params: OnChangeParams) => onChange(params.value)}
      value={value}
      maxDropdownHeight='300px'
      size='compact'
      type={TYPE.select}
      overrides={overrides}
      backspaceRemoves
      clearable
      closeOnSelect
      deleteRemoves
      escapeClearsValue
      filterOutSelected
      multi
      onBlurResetsInput
      onCloseResetsInput
      onSelectResetsInput
      searchable
    />
  );
};

export default MultiStringSelect;
