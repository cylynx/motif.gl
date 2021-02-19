import React from 'react';
import { Tab, Tabs } from 'baseui/tabs';
import { Theme } from 'baseui/theme';

import { IUseSearchOptions, TActiveKey } from '../types';
import SearchEdge from './SearchEdge';
import SearchNode from './SearchNode';
import useSearchOption from '../hooks/useSearchOption';
import { SearchOptions } from '../../../../redux/graph';

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
  const { searchOptions, updateTabs } = useSearchOption() as IUseSearchOptions;
  const { activeTabs } = searchOptions as SearchOptions;

  const onTabChange = ({ activeKey }: TActiveKey) => {
    updateTabs(activeKey);
  };

  return (
    <Tabs
      activeKey={activeTabs}
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
      <Tab key='nodes' title='Node'>
        <SearchNode />
      </Tab>
      <Tab key='edges' title='Edge'>
        <SearchEdge />
      </Tab>
    </Tabs>
  );
};

export default MainSection;
