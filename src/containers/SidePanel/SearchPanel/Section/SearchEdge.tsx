import React, { useContext } from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams } from 'baseui/select';
import { IEdge } from '@antv/g6';
import useGraphSearch from '../hooks/useGraphSearch';
import {
  Edge,
  Node,
  EdgeInformation,
  SearchOptions,
} from '../../../../redux/graph';
import AsyncSingleSelect from '../../../../components/AsyncSingleSelect';
import { GraphRefContext } from '../../../Graph';
import useGraphBehaviors from '../../../Graph/hooks/useGraphBehaviors';
import useSearchOption from '../hooks/useSearchOption';
import { IUseSearchOptions } from '../types';
import {
  ControlContainerStyle,
  DropdownListItem,
  DropdownStyle,
} from '../Styles/SelectStyle';

const SearchEdge = () => {
  const { edgeOptions, searchEdges, searchNodes } = useGraphSearch();
  const { graph } = useContext(GraphRefContext);
  const {
    centerCanvas,
    getViewCenterPoint,
    clearEdgeHoverState,
  } = useGraphBehaviors(graph);

  const {
    searchOptions,
    updateEdgeSearch,
    updateEdgeResults,
    updateNodeResults,
  } = useSearchOption() as IUseSearchOptions;
  const { edgeSearchCase } = searchOptions as SearchOptions;

  const onSearchChange = ({ value }: OnChangeParams): void => {
    updateEdgeSearch(value);

    if (value.length === 0) {
      updateEdgeResults([]);
      graph.setAutoPaint(false);
      clearEdgeHoverState();
      centerCanvas();
      graph.paint();
      graph.setAutoPaint(true);
      return;
    }

    const [{ id: edgeId }] = value;
    const result: Edge = searchEdges(edgeId as string);
    const edge = graph.findById(edgeId as string) as IEdge;
    const sourceNodeID: string = edge.getSource().getID();
    const sourceNode: Node = searchNodes(sourceNodeID);
    const targetNodeID: string = edge.getTarget().getID();
    const targetNode: Node = searchNodes(targetNodeID);
    const edgeItemProperty: EdgeInformation = {
      sourceNode,
      edge: result,
      targetNode,
    };

    updateNodeResults([]);
    updateEdgeResults([edgeItemProperty]);

    graph.setAutoPaint(false);
    clearEdgeHoverState();
    setEdgeToHoverState(edge);
    centerCanvas();
    centerEdge(edge);
    graph.paint();
    graph.setAutoPaint(true);
  };

  const setEdgeToHoverState = (edge: IEdge) => {
    graph.setItemState(edge, 'hover', true);
  };

  const centerEdge = (edge: IEdge) => {
    const viewCenter = getViewCenterPoint();

    const edgeBBox = edge.getCanvasBBox();
    const dx = (viewCenter.x - edgeBBox.centerX) * graph.getZoom();
    const dy = (viewCenter.y - edgeBBox.centerY) * graph.getZoom();
    graph.translate(dx, dy);
  };

  return (
    <Block>
      <AsyncSingleSelect
        options={edgeOptions}
        labelKey='label'
        valueKey='id'
        placeholder='Type ID to find an edge'
        onChange={onSearchChange}
        value={edgeSearchCase}
        overrides={{
          ControlContainer: {
            style: ControlContainerStyle,
          },
          DropdownListItem: {
            style: DropdownListItem,
          },
          Dropdown: {
            style: DropdownStyle,
          },
        }}
      />
    </Block>
  );
};

export default SearchEdge;
