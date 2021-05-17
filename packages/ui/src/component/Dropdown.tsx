import React, { FC } from 'react';
import { StatefulSelect, SelectProps } from 'baseui/select';
import * as Icon from '../../../motif/src/components/Icons';

type DropdownProps = SelectProps & {
  transparent?: boolean;
  isOpen?: boolean;
  fontSize: string | number;
  popoverOverride?: any;
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
    <StatefulSelect
      size='compact'
      placeholder='Select'
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
          style: ({ $theme }) => {
            return {
              borderColor: transparent
                ? 'transparent'
                : $theme.colors.textSecondary,
              backgroundColor: transparent
                ? 'transparent'
                : $theme.colors.primary700,
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
