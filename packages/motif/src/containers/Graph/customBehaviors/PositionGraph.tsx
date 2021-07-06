import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@cylynx/graphin';
import { useContext, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GraphSlices, NodePosParams } from '../../../redux/graph';

import useLayout from '../../../redux/graph/hooks/useLayout';

const PositionGraph = () => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  const { layout, changeGraphLayout } = useLayout();
  const dispatch = useDispatch();

  const handlePosChange = (params: NodePosParams[]) => {
    dispatch(GraphSlices.updateNodePosition(params));
  };

  const dispatchNodePos = (e: IG6GraphEvent) => {
    const { id, x, y } = e.item.getModel();

    // user perform drags without brush select and lasso select
    // only update single node position
    const selectedNode = graph.findAllByState('node', 'selected');
    if (selectedNode.length === 0) {
      handlePosChange([{ nodeId: id, x, y }]);
      return;
    }

    // update selected node position if drag with brush, lasso and multi select
    const nodePositions: NodePosParams[] = [];
    const nodePosCollection = selectedNode.reduce((acc, node) => {
      const { id, x, y } = node.getModel();
      const params: NodePosParams = { nodeId: id, x, y };
      acc.push(params);

      return acc;
    }, nodePositions);

    handlePosChange(nodePosCollection);
  };

  const onDragEnd = (e: IG6GraphEvent): void => {
    if (layout.type === 'preset') {
      // dispatchNodePos(e);
      return;
    }

    const params = {
      layout: { id: 'preset' },
    };
    changeGraphLayout(params);
    // dispatchNodePos(e);
  };

  /**
   * Update all the node position when layout is changed
   * - For GraphFlatten to remember the node position to handle visibilities.
   */
  const onLayoutChange = () => {
    const nodePositions: NodePosParams[] = [];
    const nodePosCollection = graph.getNodes().reduce((acc, node) => {
      const { id, x, y } = node.getModel();
      const params: NodePosParams = { nodeId: id, x, y };
      acc.push(params);

      return acc;
    }, nodePositions);

    handlePosChange(nodePosCollection);
  };

  useLayoutEffect(() => {
    graph.on('node:dragend', onDragEnd);
    // graph.on('afterlayout', onLayoutChange);

    return (): void => {
      graph.off('node:dragend', onDragEnd);
      // graph.off('afterlayout', onLayoutChange);
    };
  });

  return null;
};

export default PositionGraph;
