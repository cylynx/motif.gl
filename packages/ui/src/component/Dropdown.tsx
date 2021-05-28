import React, { FC } from 'react';
import { StatefulSelect, StatefulSelectProps } from 'baseui/select';
import * as Icon from '../../../motif/src/components/Icons';

type DropdownProps = StatefulSelectProps & {
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
