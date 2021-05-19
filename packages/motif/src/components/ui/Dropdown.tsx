import React, { FC } from 'react';
import { Select, SelectProps } from 'baseui/select';
import * as Icon from '../Icons';

export type DropdownProps = SelectProps & {
  transparent?: boolean;
};

export const Dropdown: FC<DropdownProps> = ({ transparent, ...rest }) => {
  return (
    <Select
      size='compact'
      {...rest}
      overrides={{
        ControlContainer: {
          style: ({ $theme }) => {
            return {
              backgroundColor: transparent
                ? 'transparent'
                : $theme.colors.primary700,
              borderTopLeftRadius: '6px',
              borderTopRightRadius: '6px',
              borderBottomLeftRadius: '6px',
              borderBottomRightRadius: '6px',
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
