import React, { FC, ReactNode } from 'react';
import { FormControl } from 'baseui/form-control';
import { Theme } from 'baseui/theme';
import { OnChangeParams, Select, SIZE, TYPE, Value } from 'baseui/select';
import LabelTooltip from './LabelTooltip';

export type FormSelectWithTooltipProps = {
  name: string;
  onChange: (params: OnChangeParams) => any;
  tooltipText: ReactNode;
  options: Value;
  value: Value;
};

const FormSelectWithTooltip: FC<FormSelectWithTooltipProps> = ({
  name,
  onChange,
  tooltipText,
  options,
  value,
}) => {
  return (
    <FormControl
      label={<LabelTooltip text={tooltipText} />}
      overrides={{
        Label: {
          style: ({ $theme }: { $theme: Theme }) => ({
            marginBottom: $theme.sizing.scale0,
          }),
        },
      }}
    >
      <Select
        aria-label={name}
        autoFocus={false}
        backspaceRemoves={false}
        backspaceClearsInputValue={false}
        clearable={false}
        creatable={false}
        deleteRemoves
        maxDropdownHeight='200px'
        multi={false}
        openOnClick
        onChange={onChange}
        size={SIZE.compact}
        type={TYPE.select}
        options={
          options ?? [
            {
              id: '123',
              label: '123',
            },
          ]
        }
        valueKey='id'
        value={value ?? [{ id: '123', label: '123' }]}
      />
    </FormControl>
  );
};

export default FormSelectWithTooltip;
