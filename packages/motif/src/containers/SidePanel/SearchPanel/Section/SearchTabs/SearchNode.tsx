import React, { useContext } from 'react';
import { INode } from '@antv/g6';

import { OnChangeParams } from 'baseui/select';

import useGraphSearch from '../../hooks/useGraphSearch';
import { Node, SearchOptions } from '../../../../../redux/graph';
import { GraphRefContext } from '../../../../Graph';
import useGraphBehaviors from '../../../../Graph/hooks/useGraphBehaviors';
import useSearchOption from '../../hooks/useSearchOption';
import {
  ControlContainerStyle,
  DropdownListItem,
  DropdownStyle,
} from '../../Styles/SelectStyle';
import BatchSingleSelect from '../../../../../components/BatchSingleSelect';

const SearchNode = () => {
  const { nodeOptions, searchNodes } = useGraphSearch();
  const { graph } = useContext(GraphRefContext);
  const { centerCanvas, clearNodeHoverState, centerNode } =
    useGraphBehaviors(graph);

  const {
    searchOptions,
    updateNodeSearch,
    updateNodeResults,
    updateEdgeResults,
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
    updateEdgeResults([]);

    const node = graph.findById(nodeId as string) as INode;
    graph.setAutoPaint(false);
    clearNodeHoverState();
    setNodeToHoverState(node);
    centerCanvas();
    centerNode(node);
    graph.paint();
    graph.setAutoPaint(true);
  };

  const setNodeToHoverState = (node: INode) => {
    const nodeID: string = node.getID();
    graph.setItemState(nodeID, 'hover', true);
  };

  return (
    <BatchSingleSelect
      options={nodeOptions}
      labelKey='label'
      valueKey='id'
      placeholder='Type ID to find a node'
      onChange={onSearchChange}
      value={nodeSearchCase}
      size='compact'
      maxDropdownHeight='300px'
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
  );
};

export default SearchNode;
