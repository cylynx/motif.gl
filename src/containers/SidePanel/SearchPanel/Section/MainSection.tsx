import React, { useContext, Fragment } from 'react';
import { Tab, Tabs } from 'baseui/tabs';
import { Theme } from 'baseui/theme';

import { Block } from 'baseui/block';
import { IUseSearchOptions, TActiveKey } from '../types';
import SearchEdge from './SearchEdge';
import SearchNode from './SearchNode';
import useSearchOption from '../hooks/useSearchOption';
import { SearchOptions } from '../../../../redux/graph';
import { GraphRefContext } from '../../../Graph';
import useGraphBehaviors from '../../../Graph/hooks/useGraphBehaviors';

const TabContentStyle = ({ $theme }: { $theme: Theme }) => ({
  paddingTop: $theme.sizing.scale100,
  paddingBottom: $theme.sizing.scale100,
  paddingLeft: 0,
  paddingRight: 0,
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
  ':hover': {
    backgroundColor: $theme.colors.backgroundTertiary,
    borderTopLeftRadius: $theme.sizing.scale200,
    borderTopRightRadius: $theme.sizing.scale200,
  },
});

const TabBarStyle = ({ $theme }: { $theme: Theme }) => ({
  borderBottomLeftRadius: $theme.sizing.scale500,
  borderBottomRightRadius: $theme.sizing.scale500,
  borderTopLeftRadius: $theme.sizing.scale500,
  borderTopRightRadius: $theme.sizing.scale500,
  backgroundColor: $theme.colors.backgroundSecondary,
});

const MainSection = () => {
  const { searchOptions, updateTabs } = useSearchOption() as IUseSearchOptions;
  const { activeTabs } = searchOptions as SearchOptions;
  const { graph } = useContext(GraphRefContext);
  const { centerCanvas } = useGraphBehaviors(graph);

  const onTabChange = ({ activeKey }: TActiveKey) => {
    if (activeTabs === activeKey) {
      return;
    }

    updateTabs(activeKey);
    centerCanvas();
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
      <Tab key='nodes' title={<Block as='span'>Nodes</Block>}>
        <SearchNode />
      </Tab>
      <Tab key='edges' title={<Block as='span'>Edges</Block>}>
        <SearchEdge />
      </Tab>
    </Tabs>
  );
};

export default MainSection;
