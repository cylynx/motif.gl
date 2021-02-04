import { IG6GraphEvent } from '@antv/graphin';
import { useCallback } from 'react';
import { IEdge, INode, IGraph } from '@antv/g6';
import { isBigDataSet } from '../../../../utils/utils';

const useGraphBehaviors = (graph: IGraph) => {
  const clearAllStates = useCallback(() => {
    graph.getNodes().forEach((node: INode) => {
      graph.clearItemStates(node, ['inactive', 'active']);
    });

    graph.getEdges().forEach((edge: IEdge) => {
      graph.clearItemStates(edge, ['inactive', 'active']);
    });
  }, [graph]);

  const disableAllNodeEdges = useCallback(() => {
    graph.getNodes().forEach((node: INode) => {
      graph.clearItemStates(node, ['inactive', 'active']);
      graph.setItemState(node, 'inactive', true);
    });

    graph.getEdges().forEach((edge: IEdge) => {
      graph.clearItemStates(edge, ['inactive', 'active']);
      graph.setItemState(edge, 'inactive', true);
    });
  }, [graph]);

  const resetNodeEdgeStates = useCallback(
    (e: IG6GraphEvent) => {
      const { cfg } = e.currentTarget;
      const isBigData: boolean = isBigDataSet(
        cfg.nodes.length,
        cfg.edges.length,
      );
      if (isBigData) {
        return;
      }

      graph.setAutoPaint(false);
      clearAllStates();
      graph.paint();
      graph.setAutoPaint(true);
    },
    [graph],
  );

  return { disableAllNodeEdges, resetNodeEdgeStates };
};

export default useGraphBehaviors;
