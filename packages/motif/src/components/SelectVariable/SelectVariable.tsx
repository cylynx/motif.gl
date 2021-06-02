/* eslint-disable no-shadow */
import React from 'react';
import { Block } from 'baseui/block';
import { OptgroupsT, SelectProps, SelectOverrides } from 'baseui/select';
import { getIcon, TypeProps } from '../TagData';
import { Dropdown, DropdownProps } from '../ui/Dropdown';

export type SelectVariableOption = {
  id: string;
  label: string;
  from?: string;
  format?: string;
  analyzerType?: string;
  type: TypeProps;
  optionKey?: string;
};

export type SelectOptions = {
  __ungrouped: any[];
  Nodes: SelectVariableOption[];
  Edges: SelectVariableOption[];
};

export type SelectVariableProps = Omit<
  DropdownProps,
  'options' | 'onChange'
> & {
  value: SelectVariableOption[];
  options: SelectOptions & OptgroupsT;
  onChange?: (obj: { [key: string]: string }) => void;
  placeholder?: string;
  overrides?: SelectOverrides;
  [x: string]: any;
};

const getValueLabel: SelectProps['getValueLabel'] = ({ option }) => {
  return (
    <Block display='flex' alignItems='center'>
      <Block as='span' position='relative' top='3px'>
        {getIcon(option.from)}
      </Block>
      {getIcon(option.type)}
      {option.label}
    </Block>
  );
};

const getOptionLabel: SelectProps['getOptionLabel'] = ({ option }) => {
  return (
    <Block display='flex' alignItems='center'>
      {getIcon(option.type)}
      {option.label}
    </Block>
  );
};

const SelectVariable = ({
  value = [],
  options,
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
    <Dropdown
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
