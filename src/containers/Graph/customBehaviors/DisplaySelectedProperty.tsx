import { useContext, useLayoutEffect } from 'react';
import { INode, IEdge } from '@antv/g6';
import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@antv/graphin';
import { useSelector } from 'react-redux';
import { IUserEdge } from '@antv/graphin/lib/typings/type';
import uniq from 'lodash/uniq';
import { EdgeInformation, GraphSelectors, Node } from '../../../redux/graph';
import useGraphSearch from '../../SidePanel/SearchPanel/hooks/useGraphSearch';
import useSearchOption from '../../SidePanel/SearchPanel/hooks/useSearchOption';

const DisplaySelectedProperty = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  const { searchNodes } = useGraphSearch();
  const { updateEdgeResults, updateNodeResults } = useSearchOption();
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );

  useLayoutEffect(() => {
    const displayPropertyInformation = (_: IG6GraphEvent): void => {
      // obtain selected edges
      const selectEdgeWithMouseEvent: IEdge[] = graph.findAllByState(
        'edge',
        'selected',
      );

      const sources: string[] = [];
      const targets: string[] = [];

      const edgeInformation: EdgeInformation[] = selectEdgeWithMouseEvent.map(
        (selectedEdge: IEdge) => {
          const edgeID: string = selectedEdge.get('model').id;
          const edge = graphVisible.edges.find((edge: IUserEdge) => {
            return edgeID === edge.id;
          });

          const sourceID: string = selectedEdge.getSource().getID();
          sources.push(sourceID);
          const sourceNode = searchNodes(sourceID);

          const targetID: string = selectedEdge.getTarget().getID();
          targets.push(sourceID);
          const targetNode = searchNodes(targetID);

          return {
            sourceNode,
            edge,
            targetNode,
          };
        },
      );

      updateEdgeResults(edgeInformation);

      const sourceAndTargets: string[] = uniq([...sources, ...targets]);

      // obtain selected nodes
      const selectNodeWithMouseEvent: INode[] = graph.findAllByState(
        'node',
        'selected',
      );

      const selectedNodes: Node[] = selectNodeWithMouseEvent
        .filter((node: INode) => {
          const nodeID: string = node.get('model').id;
          return sourceAndTargets.includes(nodeID) === false;
        })
        .map((node: INode) => {
          const nodeID: string = node.get('model').id;
          return searchNodes(nodeID);
        });

      updateNodeResults(selectedNodes);
    };

    graph.on('nodeselectchange', displayPropertyInformation);

    return (): void => {
      graph.off('nodeselectchange', displayPropertyInformation);
    };
  }, [graphVisible]);

  return null;
};

export default DisplaySelectedProperty;
