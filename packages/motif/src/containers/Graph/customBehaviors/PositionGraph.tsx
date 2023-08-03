import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@antv/graphin';
import { useContext, useLayoutEffect } from 'react';
import { useDispatch } from '../../../redux/hooks';
import { debounce } from 'lodash';
import { GraphSlices, NodePosParams } from '../../../redux/graph';

import useLayout from '../../../redux/graph/hooks/useLayout';

const PositionGraph = () => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  const { layout, changeGraphLayout } = useLayout();
  const dispatch = useDispatch();

  const handlePosChange = (params: NodePosParams[]) => {
    dispatch(GraphSlices.updateNodePosition(params));
  };

  const registerDragPosition = (e: IG6GraphEvent) => {
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

  const onDragEnd = (e: IG6GraphEvent) => {
    if (layout.type === 'preset') {
      registerDragPosition(e);
      return;
    }

    const params = {
      layout: { id: 'preset' },
    };
    changeGraphLayout(params);
    registerAllPosition();
  };

  /**
   * Update all the node position when layout is changed
   * - For GraphFlatten to remember the node position to handle visibilities.
   */

  const registerAllPosition = () => {
    const registerNodePosition = debounce(() => {
      const nodePositions: NodePosParams[] = [];
      const nodePosCollection = graph.getNodes().reduce((acc, node) => {
        const { id, x, y } = node.getModel();
        const params: NodePosParams = { nodeId: id, x, y };
        acc.push(params);
        return acc;
      }, nodePositions);

      handlePosChange(nodePosCollection);
    }, 250);

    registerNodePosition();
  };

  useLayoutEffect(() => {
    graph.on('node:dragend', onDragEnd);

    return (): void => {
      graph.off('node:dragend', onDragEnd);
    };
  });

  return null;
};

export default PositionGraph;
