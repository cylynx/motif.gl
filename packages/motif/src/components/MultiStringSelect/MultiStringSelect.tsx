import React, { FC } from 'react';
import { OnChangeParams, Value, TYPE } from 'baseui/select';
import { Dropdown } from '../ui';

type MultiStringSelectType = {
  placeholder: string;
  onChange?: (params: Value) => void;
  value: Value;
  options: Value;
};

const MultiStringSelect: FC<MultiStringSelectType> = ({
  placeholder,
  value,
  options,
  onChange,
}) => {
  return (
    <Dropdown
      placeholder={placeholder}
      options={options}
      onChange={(params: OnChangeParams) => onChange(params.value)}
      value={value}
      maxDropdownHeight='300px'
      size='compact'
      type={TYPE.select}
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
