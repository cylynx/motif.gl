import { useContext, useLayoutEffect } from 'react';
import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@antv/graphin';
import { IEdge, INode } from '@antv/g6';
import { isBigDataSet } from '../../../utils/utils';
import { interactionStates } from '../../../constants/graph-shapes';

const ActivateNodeRelations = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;

  const clearAllStates = () => {
    graph.getNodes().forEach((node: INode) => {
      graph.clearItemStates(node, interactionStates);
    });

    graph.getEdges().forEach((edge: IEdge) => {
      graph.clearItemStates(edge, interactionStates);
    });
  };

  const resetNodeEdgeStates = (e: IG6GraphEvent) => {
    const { cfg } = e.currentTarget;
    const isBigData: boolean = isBigDataSet(cfg.nodes.length, cfg.edges.length);
    if (isBigData) {
      return;
    }

    graph.setAutoPaint(false);
    clearAllStates();
    graph.paint();
    graph.setAutoPaint(true);
  };

  const disableAllNodeEdges = () => {
    graph.getNodes().forEach((node: INode) => {
      graph.clearItemStates(node, interactionStates);
      graph.setItemState(node, 'inactive', true);
    });

    graph.getEdges().forEach((edge: IEdge) => {
      graph.clearItemStates(edge, interactionStates);
      graph.setItemState(edge, 'inactive', true);
    });
  };

  const highlightNode = (node: INode) => {
    if (node.hasState('selected') === false) {
      graph.setItemState(node, 'inactive', false);
      graph.setItemState(node, 'selected', true);
      node.toFront();
    }
  };

  const highlightEdgeRelations = (currentNode: INode): void => {
    const currentNodeID: string = currentNode.getID();

    currentNode.getEdges().forEach((edge: IEdge) => {
      graph.setItemState(edge, 'selected', true);

      const edgeSource: INode = edge.getSource();
      const edgeSourceID: string = edgeSource.getID();

      if (edgeSourceID !== currentNodeID) {
        if (edgeSource.hasState('selected') === false) {
          highlightNode(edgeSource);
        }
      }

      const edgeTarget: INode = edge.getTarget();
      const edgeTargetID: string = edgeTarget.getID();

      if (edgeTargetID !== currentNodeID) {
        if (edgeTarget.hasState('selected') === false) {
          highlightNode(edgeTarget);
        }
      }
    });
  };

  const onNodeHover = (e: IG6GraphEvent): void => {
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
  };

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
