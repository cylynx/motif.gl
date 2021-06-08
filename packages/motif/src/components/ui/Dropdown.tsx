import React, { FC } from 'react';
import { Select, SelectProps, SelectOverrides } from 'baseui/select';
import * as Icon from '../Icons';

export type DropdownProps = SelectProps & {
  transparent?: boolean;
  overrides?: SelectOverrides;
};

/**
 * To prevent option not displayed in Jupyter Notebook
 */
const SelectFieldPopoverOverrides = {
  props: {
    overrides: {
      Body: {
        style: () => ({ zIndex: 1 }),
      },
    },
  },
};

const TagOverrides = {
  props: {
    overrides: {
      Root: {
        style: () => ({
          marginTop: '2px',
          marginBottom: '2px',
          marginLeft: '2px',
          marginRight: '2px',
          height: '20px',
        }),
      },
    },
  },
};

export const Dropdown: FC<DropdownProps> = ({
  transparent,
  overrides,
  ...rest
}) => {
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
                : $theme.colors.inputFill,
            };
          },
        },
        SelectArrow: {
          component: ({ $isOpen }: { $isOpen: boolean }) => {
            return $isOpen ? <Icon.ChevronUp /> : <Icon.ChevronDown />;
          },
        },
        Tag: TagOverrides,
        Popover: SelectFieldPopoverOverrides,
        ...overrides,
      }}
    />
  );
};

export default Dropdown;
