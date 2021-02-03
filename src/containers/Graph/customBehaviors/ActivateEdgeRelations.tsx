import { useCallback, useContext, useLayoutEffect } from 'react';
import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@antv/graphin';

import { IEdge, INode } from '@antv/g6';
import { interactionStates } from '../../../constants/graph-shapes';
import { isBigDataSet } from '../../../utils/utils';

const ActivateEdgeRelations = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;

  const clearNodeEdgeStates = useCallback((): void => {
    graph.findAllByState('node', 'selected').forEach((node: INode) => {
      graph.clearItemStates(node, interactionStates);
    });
    graph.findAllByState('edge', 'selected').forEach((edge: IEdge) => {
      graph.clearItemStates(edge, interactionStates);
    });
  }, []);

  const highlightEdge = useCallback((currentEdge: IEdge): void => {
    graph.setItemState(currentEdge, 'selected', true);
    currentEdge.toFront();
  }, []);

  const highlightNodes = useCallback((source: INode, target: INode): void => {
    const sourceNode = graph.findById(source.getID()) as INode;
    const targetNode = graph.findById(target.getID()) as INode;

    [sourceNode, targetNode].forEach((node: INode) => {
      graph.setItemState(node, 'selected', true);
    });
  }, []);

  const onEdgeClick = useCallback((e: IG6GraphEvent) => {
    const currentEdge = e.item as IEdge;
    const sourceNode: INode = currentEdge.get('source');
    const targetNode: INode = currentEdge.get('target');

    const { cfg } = e.currentTarget;
    const isBigData: boolean = isBigDataSet(cfg.nodes.length, cfg.edges.length);

    graph.setAutoPaint(false);

    clearNodeEdgeStates();
    highlightEdge(currentEdge);
    if (isBigData === false) {
      highlightNodes(sourceNode, targetNode);
    }

    graph.paint();
    graph.setAutoPaint(true);
  }, []);

  useLayoutEffect(() => {
    graph.on('edge:click', onEdgeClick);

    return (): void => {
      graph.off('edge:click', onEdgeClick);
    };
  }, []);
  return null;
};

export default ActivateEdgeRelations;
