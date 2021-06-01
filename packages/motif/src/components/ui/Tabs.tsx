import React, { FC } from 'react';
import {
  Tabs as BaseTabs,
  Tab as BaseTab,
  TabsProps,
  TabProps,
} from 'baseui/tabs-motion';
import { Theme } from 'baseui/theme';

const TabHighlight = ({ $theme }: { $theme: Theme }) => ({
  backgroundColor: $theme.colors.accent500,
  height: '3px',
  borderRadius: '6px',
});

const TabBorder = () => ({
  backgroundColor: 'transparent',
  borderRadius: '6px',
});

export const Tabs: FC<TabsProps> = ({ children, overrides, ...rest }) => {
  return (
    <BaseTabs
      {...rest}
      overrides={{
        TabHighlight: {
          style: TabHighlight,
        },
        TabBorder: {
          style: TabBorder,
        },
        ...overrides,
      }}
    >
      {children}
    </BaseTabs>
  );
};

export const Tab: FC<TabProps> = ({ children, overrides, ...rest }) => {
  return (
    <BaseTab
      {...rest}
      overrides={{
        Tab: {
          style: () => {
            return {
              background: 'transparent',
            };
          },
        },
        ...overrides,
      }}
    >
      {children}
    </BaseTab>
  );
};
