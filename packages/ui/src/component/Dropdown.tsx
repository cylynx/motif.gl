import React, { FC } from 'react';
import { StatefulSelect, SelectProps } from 'baseui/select';
import * as Icon from '../../../motif/src/components/Icons';

type DropdownProps = SelectProps & {
  transparent?: boolean;
};

export const Dropdown: FC<DropdownProps> = ({ transparent, ...rest }) => {
  return (
    <StatefulSelect
      size='compact'
      {...rest}
      overrides={{
        ControlContainer: {
          style: ({ $theme }) => {
            return {
              borderColor: transparent
                ? 'transparent'
                : $theme.colors.textSecondary,
              backgroundColor: transparent
                ? 'transparent'
                : $theme.colors.primary700,
              borderRadius: '6px',
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
