import React, { FC } from 'react';
import {
  OnChangeParams,
  Value,
  Select,
  SelectProps,
  TYPE,
} from 'baseui/select';
import * as Icon from '../Icons';

export enum DropdownFontSize {
  SMALL,
  BIG,
}

type DropdownProps = SelectProps & {
  disabled?: boolean;
  transparent?: boolean;
  fontSize: DropdownFontSize;
  onChange: (params: OnChangeParams) => any;
  value: Value;
  type?: TYPE[keyof TYPE];
  isOpen?: boolean;
};

export const RegularDropdown: FC<DropdownProps> = ({
  disabled,
  transparent,
  fontSize,
  onChange,
  value,
  type = TYPE.select,
}) => {
  return (
    <Select
      placeholder='Select'
      disabled={disabled}
      onChange={onChange}
      value={value}
      type={type}
      options={[
        { label: 'AliceBlue', id: '#F0F8FF' },
        { label: 'AntiqueWhite', id: '#FAEBD7' },
        { label: 'Aqua', id: '#00FFFF' },
        { label: 'Aquamarine', id: '#7FFFD4' },
        { label: 'Azure', id: '#F0FFFF' },
        { label: 'Beige', id: '#F5F5DC' },
      ]}
      overrides={{
        ControlContainer: {
          style: () => {
            return {
              backgroundColor: transparent ? '#32323A' : 'none',
            };
          },
        },
        Placeholder: {
          style: () => {
            return {
              fontSize: fontSize === DropdownFontSize.SMALL ? '14px' : '16px',
            };
          },
        },
        SelectArrow: {
          component: ({ $isOpen }: { $isOpen: boolean }) => {
            return $isOpen ? <Icon.ChevronUp /> : <Icon.ChevronDown />;
          },
        },
      }}
    />
  );
};
