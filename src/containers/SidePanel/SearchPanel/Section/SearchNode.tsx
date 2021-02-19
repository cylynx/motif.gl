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

const SearchNode = () => {
  const { nodeOptions, searchNodes } = useGraphSearch();
  const { graph } = useContext(GraphRefContext);
  const { centerCanvas, getViewCenterPoint } = useGraphBehaviors(graph);

  const {
    searchOptions,
    updateNodeSearch,
    updateSearchResults,
  } = useSearchOption();
  const { nodeSearchCase } = searchOptions as SearchOptions;

  const onSearchChange = ({ value }: OnChangeParams): void => {
    updateNodeSearch(value);

    if (value.length === 0) {
      updateSearchResults([]);
      graph.setAutoPaint(false);
      clearNodeHoverState();
      centerCanvas();
      graph.paint();
      graph.setAutoPaint(true);
      return;
    }

    const [{ id: nodeId }] = value;
    const result: Node[] = searchNodes(nodeId as string);
    updateSearchResults(result);

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
    graph.setItemState(node, 'hover', true);
  };

  const clearNodeHoverState = () => {
    graph.findAllByState('node', 'hover').forEach((node: INode) => {
      graph.clearItemStates(node, ['hover']);
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
      />
    </Block>
  );
};

export default SearchNode;
