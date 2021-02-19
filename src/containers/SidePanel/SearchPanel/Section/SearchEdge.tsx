import React, { useContext } from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams } from 'baseui/select';
import { IEdge } from '@antv/g6';
import useGraphSearch from '../hooks/useGraphSearch';
import { Edge, SearchOptions } from '../../../../redux/graph';
import AsyncSingleSelect from '../../../../components/AsyncSingleSelect';
import { GraphRefContext } from '../../../Graph';
import useGraphBehaviors from '../../../Graph/hooks/useGraphBehaviors';
import useSearchOption from '../hooks/useSearchOption';
import { IUseSearchOptions } from '../types';

const SearchEdge = () => {
  const { edgeOptions, searchEdges } = useGraphSearch();
  const { graph } = useContext(GraphRefContext);
  const { centerCanvas, getViewCenterPoint } = useGraphBehaviors(graph);

  const {
    searchOptions,
    updateEdgeSearch,
    updateSearchResults,
  } = useSearchOption() as IUseSearchOptions;
  const { edgeSearchCase } = searchOptions as SearchOptions;

  const onSearchChange = ({ value }: OnChangeParams): void => {
    updateEdgeSearch(value);

    if (value.length === 0) {
      updateSearchResults([]);
      graph.setAutoPaint(false);
      clearEdgeHoverState();
      centerCanvas();
      graph.paint();
      graph.setAutoPaint(true);
      return;
    }

    const [{ id: edgeId }] = value;
    const result: Edge[] = searchEdges(edgeId as string);
    updateSearchResults(result);

    const edge = graph.findById(edgeId as string) as IEdge;
    graph.setAutoPaint(false);
    clearEdgeHoverState();
    setEdgeToHoverState(edge);
    centerCanvas();
    centerEdge(edge);
    graph.paint();
    graph.setAutoPaint(true);
  };

  const clearEdgeHoverState = () => {
    graph.findAllByState('edge', 'hover').forEach((edge: IEdge) => {
      graph.clearItemStates(edge, ['hover']);
    });
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
      />
    </Block>
  );
};

export default SearchEdge;
