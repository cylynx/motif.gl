/* eslint-disable no-shadow */
import React, { useMemo } from 'react';
import { Select } from 'baseui/select';
import { Block } from 'baseui/block';
import { getIcon, TypeProps } from '../TagData';

export type SelectVariableOption = {
  id: string;
  label: string;
  type: TypeProps;
};

export type SelectVariableProps = {
  value: SelectVariableOption[];
  options: {
    Nodes: SelectVariableOption[];
    Edges: SelectVariableOption[];
  };
  onChange?: (obj: { [key: string]: string }) => void;
  placeholder?: string;
};

const testOptions = {
  Nodes: [
    { label: 'data.id', id: 'data.id', type: 'string' },
    { label: 'dataStr', id: 'datastr', type: 'boolean' },
  ],
  Edges: [
    { label: 'value', id: 'value', type: 'real' },
    { label: 'start_dt', id: 'start_dt', type: 'timestamp' },
  ],
};

const getLabel = ({ option }: { option: any }) => {
  return (
    <Block display='flex' alignItems='center'>
      {getIcon(option.type)}
      {option.label}
    </Block>
  );
};

const SelectVariable = ({
  value = [],
  options = testOptions,
  onChange: onChangeProps,
  placeholder = 'Select Variable',
}: SelectVariableProps) => {
  const onChangeSelection = (value: any) => {
    if (onChangeProps) {
      onChangeProps(value[0]);
    }
    return value;
  };

  return (
    // @ts-ignore
    <Select
      options={options}
      value={value}
      size='compact'
      placeholder={placeholder}
      onChange={({ value }) => onChangeSelection(value)}
      getOptionLabel={getLabel}
      getValueLabel={getLabel}
      maxDropdownHeight='300px'
    />
  );
};

export default SelectVariable;
