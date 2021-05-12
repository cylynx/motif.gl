import React, { useContext } from 'react';
import { Tab, Tabs, FILL } from 'baseui/tabs-motion';
import { Theme } from 'baseui/theme';

import { Block } from 'baseui/block';
import { IUseSearchOptions, TActiveKey } from '../../types';
import SearchEdge from './SearchEdge';
import SearchNode from './SearchNode';
import useSearchOption from '../../hooks/useSearchOption';
import { GraphAttribute, SearchOptions } from '../../../../../redux/graph';
import { GraphRefContext } from '../../../../Graph';
import useGraphBehaviors from '../../../../Graph/hooks/useGraphBehaviors';

const TabHighlight = () => ({
  backgroundColor: '#488F80',
  height: '3px',
});

const TabBorder = ({ $theme }: { $theme: Theme }) => ({
  backgroundColor: $theme.colors.backgroundTertiary,
});

const TabList = ({ $theme }: { $theme: Theme }) => ({
  backgroundColor: $theme.colors.backgroundSecondary,
});

const SearchTabs = () => {
  const { searchOptions, updateTabs } = useSearchOption() as IUseSearchOptions;
  const { activeTabs } = searchOptions as SearchOptions;
  const { graph } = useContext(GraphRefContext);
  const { centerCanvas } = useGraphBehaviors(graph);

  const onTabChange = ({ activeKey }: TActiveKey) => {
    if (activeTabs === activeKey) {
      return;
    }

    updateTabs(activeKey as GraphAttribute);
    centerCanvas();
  };

  return (
    <Tabs
      activeKey={activeTabs}
      onChange={onTabChange}
      fill={FILL.fixed}
      overrides={{
        TabHighlight: {
          style: TabHighlight,
        },
        TabList: {
          style: TabList,
        },
        TabBorder: {
          style: TabBorder,
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

export default SearchTabs;
