import React, { useState } from 'react';
import { Tab, Tabs } from 'baseui/tabs';
import { Theme } from 'baseui/theme';

import { TActiveKey } from '../types';
import SearchEdge from './SearchEdge';
import SearchNode from './SearchNode';

const TabContentStyle = ({ $theme }: { $theme: Theme }) => ({
  paddingLeft: $theme.sizing.scale300,
  paddingRight: $theme.sizing.scale300,
  paddingTop: $theme.sizing.scale500,
  paddingBottom: $theme.sizing.scale300,
  backgroundColor: $theme.colors.backgroundTertiary,
});

const TabStyle = ({
  $theme,
  $active,
}: {
  $theme: Theme;
  $active: boolean;
}) => ({
  width: '50%',
  paddingTop: $theme.sizing.scale100,
  paddingBottom: $theme.sizing.scale100,
  textAlign: 'center',
  borderBottom: `2px solid ${$active ? '#06a2a2' : 'transparent'}`,
});

const TabBarStyle = () => ({
  backgroundColor: '#0c0b0b',
});

const MainSection = () => {
  const [activeKey, setActiveKey] = useState<TActiveKey['activeKey']>('node');

  const onTabChange = ({ activeKey }: TActiveKey) => {
    setActiveKey(activeKey);
  };

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onTabChange}
      overrides={{
        Tab: {
          // @ts-ignore
          style: TabStyle,
        },
        TabContent: {
          style: TabContentStyle,
        },
        TabBar: {
          style: TabBarStyle,
        },
      }}
    >
      <Tab key='node' title='Node'>
        <SearchNode />
      </Tab>
      <Tab key='edge' title='Edge'>
        <SearchEdge />
      </Tab>
    </Tabs>
  );
};

export default MainSection;
