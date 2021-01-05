/* eslint-disable no-shadow */
import React from 'react';
import { Select } from 'baseui/select';
import { Block } from 'baseui/block';
import { getIcon, TypeProps } from '../TagData';

export type SelectVariableOption = {
  id: string;
  label: string;
  from?: string;
  format?: string;
  analyzerType?: string;
  __optgroup?: string;
  type: TypeProps;
  optionKey?: string;
};

export type SelectOptions = {
  Nodes: SelectVariableOption[];
  Edges: SelectVariableOption[];
};

export type SelectVariableProps = {
  value: SelectVariableOption[];
  options: SelectOptions;
  onChange?: (obj: { [key: string]: string }) => void;
  placeholder?: string;
  [x: string]: any;
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

const getValueLabel = ({ option }: { option: SelectVariableOption }) => {
  return (
    <Block display='flex' alignItems='center'>
      <Block as='span' position='relative' top='1px'>
        {getIcon(option.from)}
      </Block>
      {getIcon(option.type)}
      {option.label}
    </Block>
  );
};

const getOptionLabel = ({ option }: { option: SelectVariableOption }) => {
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
  ...rest
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
      getOptionLabel={getOptionLabel}
      getValueLabel={getValueLabel}
      maxDropdownHeight='300px'
      data-testid='select-variable'
      {...rest}
    />
  );
};

export default SelectVariable;
