import React, { FC } from 'react';
import { OnChangeParams, Select, Value, TYPE } from 'baseui/select';

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
    <Select
      placeholder={placeholder}
      options={options}
      onChange={(params: OnChangeParams) => onChange(params.value)}
      value={value}
      maxDropdownHeight='300px'
      size='mini'
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
