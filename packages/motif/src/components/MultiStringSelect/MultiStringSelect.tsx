import React, { FC } from 'react';
import { Theme } from 'baseui/theme';
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
      size='compact'
      type={TYPE.select}
      overrides={{
        Tag: {
          props: {
            overrides: {
              Text: {
                style: ({ $theme }: { $theme: Theme }) => ({
                  fontSize: $theme.sizing.scale500,
                }),
              },
              Root: {
                style: ({ $theme }: { $theme: Theme }) => ({
                  marginTop: $theme.sizing.scale0,
                  marginBottom: $theme.sizing.scale0,
                  marginRight: $theme.sizing.scale0,
                  marginLeft: $theme.sizing.scale0,
                }),
              },
            },
          },
        },
      }}
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
