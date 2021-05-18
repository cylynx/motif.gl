import React, { FC } from 'react';
import { StatefulTabs, FILL, TabsProps, Tab } from 'baseui/tabs-motion';
import { Theme } from 'baseui/theme';

type SearchTabsProps = Omit<TabsProps, 'children'> & {
  items: TabItems[];
  children?: React.ReactNode;
};

type TabItems = {
  key?: string | number;
  title: React.ReactNode;
  content: React.ReactNode;
};

const TabHighlight = ({ $theme }: { $theme: Theme }) => ({
  backgroundColor: $theme.colors.accent500,
  height: '3px',
  borderRadius: '6px',
});

const TabBorder = () => ({
  backgroundColor: 'transparent',
  borderRadius: '6px',
});

export const SearchTabs: FC<SearchTabsProps> = ({ items = [], ...rest }) => {
  return (
    <StatefulTabs
      {...rest}
      fill={FILL.fixed}
      overrides={{
        TabHighlight: {
          style: TabHighlight,
        },
        TabBorder: {
          style: TabBorder,
        },
      }}
    >
      {items.map((item: TabItems) => (
        <Tab
          key={item.key}
          title={item.title}
          overrides={{
            Tab: {
              style: () => {
                return {
                  backgroundColor: 'transparent',
                };
              },
            },
          }}
        >
          {item.content}
        </Tab>
      ))}
    </StatefulTabs>
  );
};
