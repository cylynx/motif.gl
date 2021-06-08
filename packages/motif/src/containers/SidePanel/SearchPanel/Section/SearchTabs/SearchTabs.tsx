import React, { useContext } from 'react';
import { FILL } from 'baseui/tabs-motion';
import { IUseSearchOptions, TActiveKey } from '../../types';
import SearchEdge from './SearchEdge';
import SearchNode from './SearchNode';
import useSearchOption from '../../hooks/useSearchOption';
import { GraphAttribute, SearchOptions } from '../../../../../redux/graph';
import { GraphRefContext } from '../../../../Graph';
import { Tab, Tabs } from '../../../../../components/ui';
import useGraphBehaviors from '../../../../Graph/hooks/useGraphBehaviors';

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
    <Tabs activeKey={activeTabs} onChange={onTabChange} fill={FILL.fixed}>
      <Tab
        key='nodes'
        title='Nodes'
        overrides={{
          Tab: {
            style: ({ $theme }) => {
              return {
                paddingTop: $theme.sizing.scale300,
                paddingBottom: $theme.sizing.scale300,
              };
            },
          },
          TabPanel: {
            style: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        }}
      >
        <SearchNode />
      </Tab>
      <Tab
        key='edges'
        title='Edges'
        overrides={{
          Tab: {
            style: ({ $theme }) => {
              return {
                paddingTop: $theme.sizing.scale300,
                paddingBottom: $theme.sizing.scale300,
              };
            },
          },
          TabPanel: {
            style: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        }}
      >
        <SearchEdge />
      </Tab>
    </Tabs>
  );
};

export default SearchTabs;
