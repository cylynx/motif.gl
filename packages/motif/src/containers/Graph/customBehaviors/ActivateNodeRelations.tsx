import { useCallback, useContext, useLayoutEffect } from 'react';
import { GraphinContext, GraphinContextType } from '@cylynx/graphin';
import { IEdge, INode, IG6GraphEvent } from '@antv/g6';
import { isBigDataSet } from '../../../utils/utils';
import useGraphBehaviors from '../hooks/useGraphBehaviors';

const ActivateNodeRelations = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  const { disableAllNodeEdges, resetNodeEdgeStates } = useGraphBehaviors(graph);

  const highlightNode = useCallback((node: INode) => {
    if (node.hasState('active') === false) {
      const nodeId: string = node.getID();
      graph.setItemState(nodeId, 'inactive', false);
      graph.setItemState(nodeId, 'active', true);
      node.toFront();
    }
  }, []);

  const highlightEdgeRelations = useCallback((currentNode: INode): void => {
    const currentNodeID: string = currentNode.getID();

    currentNode.getEdges().forEach((edge: IEdge) => {
      const edgeID: string = edge.getID();
      graph.setItemState(edgeID, 'active', true);

      const edgeSource: INode = edge.getSource();
      const edgeSourceID: string = edgeSource.getID();

      if (edgeSourceID !== currentNodeID) {
        if (edgeSource.hasState('active') === false) {
          highlightNode(edgeSource);
        }
      }

      const edgeTarget: INode = edge.getTarget();
      const edgeTargetID: string = edgeTarget.getID();

      if (edgeTargetID !== currentNodeID) {
        if (edgeTarget.hasState('active') === false) {
          highlightNode(edgeTarget);
        }
      }
    });
  }, []);

  const onNodeHover = useCallback((e: IG6GraphEvent): void => {
    const currentNode = e.item as INode;

    const { cfg } = e.currentTarget;
    const isBigData: boolean = isBigDataSet(cfg.nodes.length, cfg.edges.length);
    if (isBigData) {
      return;
    }

    graph.setAutoPaint(false);

    disableAllNodeEdges();
    highlightNode(currentNode);
    highlightEdgeRelations(currentNode);

    graph.paint();
    graph.setAutoPaint(true);
  }, []);

  useLayoutEffect(() => {
    graph.on('node:mouseenter', onNodeHover);
    graph.on('node:mouseleave', resetNodeEdgeStates);

    return (): void => {
      graph.off('node:mouseenter', onNodeHover);
      graph.off('node:mouseleave', resetNodeEdgeStates);
    };
  }, []);

  return null;
};

export default ActivateNodeRelations;
