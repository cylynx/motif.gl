import React, { useContext } from 'react';
import { INode } from '@antv/g6';

import { Block } from 'baseui/block';
import { OnChangeParams } from 'baseui/select';

import AsyncSingleSelect from '../../../../components/AsyncSingleSelect';
import useGraphSearch from '../hooks/useGraphSearch';
import { Node, SearchOptions } from '../../../../redux/graph';
import { GraphRefContext } from '../../../Graph';
import useGraphBehaviors from '../../../Graph/hooks/useGraphBehaviors';
import useSearchOption from '../hooks/useSearchOption';
import {
  ControlContainerStyle,
  DropdownListItem,
  DropdownStyle,
} from '../Styles/SelectStyle';

const SearchNode = () => {
  const { nodeOptions, searchNodes } = useGraphSearch();
  const { graph } = useContext(GraphRefContext);
  const { centerCanvas, getViewCenterPoint } = useGraphBehaviors(graph);

  const {
    searchOptions,
    updateNodeSearch,
    updateNodeResults,
  } = useSearchOption();
  const { nodeSearchCase } = searchOptions as SearchOptions;

  const onSearchChange = ({ value }: OnChangeParams): void => {
    updateNodeSearch(value);

    if (value.length === 0) {
      updateNodeResults([]);
      graph.setAutoPaint(false);
      clearNodeHoverState();
      centerCanvas();
      graph.paint();
      graph.setAutoPaint(true);
      return;
    }

    const [{ id: nodeId }] = value;
    const result: Node = searchNodes(nodeId as string);
    updateNodeResults([result]);

    const node = graph.findById(nodeId as string) as INode;
    graph.setAutoPaint(false);
    clearNodeHoverState();
    setNodeToHoverState(node);
    centerCanvas();
    centerNode(node);
    graph.paint();
    graph.setAutoPaint(true);
  };

  const centerNode = (node: INode) => {
    const viewCenter = getViewCenterPoint();

    const nodeBBox = node.getCanvasBBox();
    const dx = (viewCenter.x - nodeBBox.centerX) * graph.getZoom();
    const dy = (viewCenter.y - nodeBBox.centerY) * graph.getZoom();
    graph.translate(dx, dy);
  };

  const setNodeToHoverState = (node: INode) => {
    graph.setItemState(node, 'selected', true);
  };

  const clearNodeHoverState = () => {
    graph.findAllByState('node', 'selected').forEach((node: INode) => {
      graph.clearItemStates(node, ['selected']);
    });
  };

  return (
    <Block>
      <AsyncSingleSelect
        options={nodeOptions}
        labelKey='label'
        valueKey='id'
        placeholder='Type ID to find a node'
        onChange={onSearchChange}
        value={nodeSearchCase}
        overrides={{
          ControlContainer: {
            style: ControlContainerStyle,
          },
          Dropdown: {
            style: DropdownStyle,
          },

          DropdownListItem: {
            style: DropdownListItem,
          },
        }}
      />
    </Block>
  );
};

export default SearchNode;
