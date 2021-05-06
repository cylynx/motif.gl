import { useCallback, useContext, useLayoutEffect } from 'react';
import { GraphinContext, GraphinContextType } from '@cylynx/graphin';

import { IEdge, INode, IG6GraphEvent } from '@antv/g6';
import { isBigDataSet } from '../../../utils/utils';
import useGraphBehaviors from '../hooks/useGraphBehaviors';

const ActivateEdgeRelations = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  const { disableAllNodeEdges, resetNodeEdgeStates } = useGraphBehaviors(graph);

  const highlightEdge = useCallback((currentEdge: IEdge): void => {
    if (currentEdge.hasState('active') === false) {
      const currentEdgeID: string = currentEdge.getID();
      graph.setItemState(currentEdgeID, 'inactive', false);
      graph.setItemState(currentEdgeID, 'active', true);
      currentEdge.toFront();
    }
  }, []);

  const highlightNodes = useCallback((source: INode, target: INode): void => {
    const sourceNode = graph.findById(source.getID()) as INode;
    const targetNode = graph.findById(target.getID()) as INode;

    [sourceNode, targetNode].forEach((node: INode) => {
      const nodeID: string = node.getID();
      graph.setItemState(nodeID, 'inactive', false);
      graph.setItemState(nodeID, 'active', true);
    });
  }, []);

  const onEdgeClick = useCallback((e: IG6GraphEvent) => {
    const currentEdge = e.item as IEdge;
    const sourceNode: INode = currentEdge.get('source');
    const targetNode: INode = currentEdge.get('target');

    const { cfg } = e.currentTarget;
    const isBigData: boolean = isBigDataSet(cfg.nodes.length, cfg.edges.length);
    if (isBigData) return;

    graph.setAutoPaint(false);

    disableAllNodeEdges();
    highlightEdge(currentEdge);
    highlightNodes(sourceNode, targetNode);

    graph.paint();
    graph.setAutoPaint(true);
  }, []);

  useLayoutEffect(() => {
    graph.on('edge:mouseenter', onEdgeClick);
    graph.on('edge:mouseleave', resetNodeEdgeStates);

    return (): void => {
      graph.off('edge:mouseenter', onEdgeClick);
      graph.off('edge:mouseleave', resetNodeEdgeStates);
    };
  }, []);
  return null;
};

export default ActivateEdgeRelations;
