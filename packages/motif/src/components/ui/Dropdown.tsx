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
        Root: {
          style: () => ({
            paddingBottom: '4px',
          }),
        },
        ControlContainer: {
          style: ({ $theme }) => {
            return {
              backgroundColor: transparent
                ? 'transparent'
                : $theme.colors.inputFill,
            };
          },
        },
        Tag: {
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

export default Dropdown;
