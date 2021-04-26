import React, { FC, ReactNode, useMemo } from 'react';
import { FormControl } from 'baseui/form-control';
import { Theme } from 'baseui/theme';
import {
  OnChangeParams,
  Select,
  SIZE,
  TYPE,
  Value,
  Option,
} from 'baseui/select';
import LabelTooltip from './LabelTooltip';

export type FormSelectWithTooltipProps = {
  name: string;
  onChange: (params: OnChangeParams) => any;
  labelText: ReactNode;
  options: Value;
  value: string;
  setValue: (name: string, value: any, config?: Object) => void;
  tooltipText?: ReactNode;
  error?: string;
};

const FormSelectWithTooltip: FC<FormSelectWithTooltipProps> = ({
  name,
  onChange,
  labelText,
  tooltipText,
  options = [],
  value,
  error = '',
}) => {
  const selectedOption: Value = useMemo(() => {
    if (options.length === 0) return [];

    const selected: Option = options.find(
      (option: Option) => option.id === value,
    );

    if (selected === undefined) {
      const [firstOption] = options;
      return [firstOption];
    }

    return [selected];
  }, [value, options]);

  return (
    <FormControl
      label={<LabelTooltip text={labelText} tooltip={tooltipText} />}
      overrides={{
        Label: {
          style: ({ $theme }: { $theme: Theme }) => ({
            marginBottom: $theme.sizing.scale0,
          }),
        },
        Caption: {
          style: {
            position: 'absolute',
            marginTop: 0,
            marginBottom: 0,
          },
        },
        ControlContainer: {
          style: ({ $theme }: { $theme: Theme }) => ({
            marginBottom: $theme.sizing.scale200,
            position: 'relative',
          }),
        },
      }}
      error={error}
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
        options={options}
        valueKey='id'
        value={selectedOption}
      />
    </FormControl>
  );
};

export default FormSelectWithTooltip;
