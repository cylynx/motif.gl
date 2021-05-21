/* eslint-disable no-shadow */
import React, { useEffect } from 'react';
import { Select, SelectOverrides } from 'baseui/select';
import { Block } from 'baseui/block';
import { getIcon, TypeProps } from '../TagData';

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
  Nodes: SelectVariableOption[];
  Edges: SelectVariableOption[];
};

export type SelectVariableProps = {
  value: SelectVariableOption[];
  options: SelectOptions;
  onChange?: (obj: { [key: string]: string }) => void;
  placeholder?: string;
  overrides?: SelectOverrides;
  [x: string]: any;
};

const SelectFieldPopoverOverrides = {
  props: {
    overrides: {
      Body: {
        style: () => ({ zIndex: 1 }),
      },
    },
  },
};

const getValueLabel = ({ option }: { option: SelectVariableOption }) => {
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
  options,
  onChange: onChangeProps,
  placeholder = 'Select Variable',
  overrides,
  ...rest
}: SelectVariableProps) => {
  const onChangeSelection = (value: any) => {
    if (onChangeProps) {
      onChangeProps(value[0]);
    }
    return value;
  };

  useEffect(() => {
    Object.assign(overrides, {
      Popover: SelectFieldPopoverOverrides,
    });
  }, [overrides]);

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
