import React, { Fragment, useContext, useState } from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams, Value } from 'baseui/select';
import { LabelXSmall } from 'baseui/typography';
import { IGraph, IEdge } from '@antv/g6';
import useGraphSearch from '../hooks/useGraphSearch';
import { Edge } from '../../../../redux/graph';
import SingleStringSelect from '../../../../components/SingleStringSelect';
import ResultAccordion from '../Components/ResultAccordion';
import { GraphRefContext } from '../../../Graph';
import useGraphBehaviors from '../../../Graph/hooks/useGraphBehaviors';

const SearchEdge = () => {
  const [result, setResult] = useState<Edge[]>([]);
  const [searchCase, setSearchCase] = useState<Value>([]);
  const { edgeOptions, searchEdges } = useGraphSearch();
  const { graph }: { graph: IGraph } = useContext(GraphRefContext);
  const { centerCanvas, getViewCenterPoint } = useGraphBehaviors(graph);

  const onSearchChange = ({ value }: OnChangeParams): void => {
    setSearchCase(value);

    if (value.length === 0) {
      setResult([]);
      return;
    }

    const [{ id: edgeId }] = value;
    const result: Edge[] = searchEdges(edgeId as string);
    setResult(result);

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
      <SingleStringSelect
        options={edgeOptions}
        labelKey='label'
        valueKey='id'
        placeholder='Find an edge'
        onChange={onSearchChange}
        value={searchCase}
      />

      {searchCase.length > 0 && (
        <Fragment>
          <Block color='primary300' marginTop='scale800'>
            <LabelXSmall>
              Found {result.length} Edge{result.length === 1 ? '' : 's'}
            </LabelXSmall>
          </Block>

          <Block marginTop='scale200'>
            <ResultAccordion results={result} expanded />
          </Block>
        </Fragment>
      )}
    </Block>
  );
};

export default SearchEdge;
