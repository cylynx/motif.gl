import React, { useState, Fragment, useContext } from 'react';
import { IGraph, INode } from '@antv/g6';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import { OnChangeParams, Value } from 'baseui/select';

import SingleStringSelect from '../../../../components/SingleStringSelect';
import ResultAccordion from '../Components/ResultAccordion';
import useGraphSearch from '../hooks/useGraphSearch';
import { Node } from '../../../../redux/graph';
import { GraphRefContext } from '../../../Graph';
import useGraphBehaviors from '../../../Graph/hooks/useGraphBehaviors';

const SearchNode = () => {
  const [searchCase, setSearchCase] = useState<Value>([]);
  const [result, setResult] = useState<Node[]>([]);
  const { nodeOptions, searchNodes } = useGraphSearch();
  const { graph }: { graph: IGraph } = useContext(GraphRefContext);
  const { centerCanvas, getViewCenterPoint } = useGraphBehaviors(graph);

  const onSearchChange = ({ value }: OnChangeParams): void => {
    setSearchCase(value);

    if (value.length === 0) {
      setResult([]);
      graph.setAutoPaint(false);
      clearNodeHoverState();
      centerCanvas();
      graph.paint();
      graph.setAutoPaint(true);
      return;
    }

    const [{ id: nodeId }] = value;
    const result: Node[] = searchNodes(nodeId as string);
    setResult(result);

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
      <SingleStringSelect
        options={nodeOptions}
        labelKey='label'
        valueKey='id'
        placeholder='Find a node'
        onChange={onSearchChange}
        value={searchCase}
      />

      {searchCase.length > 0 && (
        <Fragment>
          <Block color='primary300' marginTop='scale800'>
            <LabelXSmall>
              Found {result.length} Node{result.length === 1 ? '' : 's'}
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

export default SearchNode;
