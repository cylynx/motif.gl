import React, { FC } from 'react';
import { OnChangeParams, Value, Select, SelectProps } from 'baseui/select';
import * as Icon from '../Icons';

type DropdownProps = SelectProps & {
  transparent?: boolean;
  onChange: (params: OnChangeParams) => any;
  value: Value;
  isOpen?: boolean;
  fontSize: string | number;
  popoverOverride: any;
};

export const Dropdown: FC<DropdownProps> = ({
  transparent,
  onChange,
  value,
  fontSize,
  popoverOverride,
  ...rest
}) => {
  return (
    <Select
      placeholder='Select'
      onChange={onChange}
      value={value}
      overrides={{
        ControlContainer: {
          style: () => {
            return {
              borderColor: transparent ? 'transparent' : '#8C8C97',
              backgroundColor: transparent ? 'transparent' : '#32323A',
              borderRadius: '6px',
              fontSize,
            };
          },
        },
        SelectArrow: {
          component: ({ $isOpen }: { $isOpen: boolean }) => {
            return $isOpen ? <Icon.ChevronUp /> : <Icon.ChevronDown />;
          },
        },
        Popover: popoverOverride,
        DropdownListItem: {
          style: () => {
            return {
              fontSize,
            };
          },
        },
      }}
      {...rest}
    />
  );
};
