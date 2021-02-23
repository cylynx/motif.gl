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
import { ITEM_PER_PAGE } from '../../../constants/widget-units';

const DisplaySelectedProperty = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  const { searchNodes } = useGraphSearch();
  const {
    updateEdgeResults,
    updateNodeResults,
    updatePagination,
  } = useSearchOption();
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );

  const sources: string[] = [];
  const targets: string[] = [];

  const setSelectedEdges = (edges: IEdge[]): number => {
    const edgeInformation: EdgeInformation[] = edges.map(
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
    return edgeInformation.length;
  };

  const setSelectedNodes = (nodes: INode[]): number => {
    const sourceAndTargets: string[] = uniq([...sources, ...targets]);

    const selectedNodes: Node[] = nodes
      .filter((node: INode) => {
        const nodeID: string = node.get('model').id;
        return sourceAndTargets.includes(nodeID) === false;
      })
      .map((node: INode) => {
        const nodeID: string = node.get('model').id;
        return searchNodes(nodeID);
      });

    updateNodeResults(selectedNodes);
    return selectedNodes.length;
  };

  const setPagination = (nodeLength: number, edgeLength: number) => {
    const totalItems = nodeLength + edgeLength;
    const totalPages = Math.ceil(totalItems / ITEM_PER_PAGE);
    const currentPage = 1;

    updatePagination(currentPage, totalItems, totalPages);
  };

  useLayoutEffect(() => {
    const displayPropertyInformation = (_: IG6GraphEvent): void => {
      const selectEdgeWithMouseEvent: IEdge[] = graph.findAllByState(
        'edge',
        'selected',
      );

      const selectNodeWithMouseEvent: INode[] = graph.findAllByState(
        'node',
        'selected',
      );

      if (selectNodeWithMouseEvent.length === 0) return;
      const selectedEdgesLength = setSelectedEdges(selectEdgeWithMouseEvent);
      const selectedNodesLength = setSelectedNodes(selectNodeWithMouseEvent);
      setPagination(selectedNodesLength, selectedEdgesLength);
    };

    graph.on('nodeselectchange', displayPropertyInformation);

    return (): void => {
      graph.off('nodeselectchange', displayPropertyInformation);
    };
  }, [graph, graphVisible]);

  return null;
};

export default DisplaySelectedProperty;
