import { useContext, useLayoutEffect } from 'react';
import { INode, IEdge } from '@antv/g6';
import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
  IUserEdge,
} from '@antv/graphin';
import { useDispatch, useSelector } from 'react-redux';
import uniq from 'lodash/uniq';
import { EdgeInformation, GraphSelectors, Node } from '../../../redux/graph';
import {
  WidgetSlices,
  WidgetSelectors,
  WidgetState,
} from '../../../redux/widget';
import useGraphSearch from '../../SidePanel/SearchPanel/hooks/useGraphSearch';
import useSearchOption from '../../SidePanel/SearchPanel/hooks/useSearchOption';
import { ITEM_PER_PAGE } from '../../../constants/widget-units';

const DisplaySelectedProperty = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  const { searchNodes } = useGraphSearch();
  const { updateEdgeResults, updateNodeResults, updatePagination } =
    useSearchOption();
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );
  const widget: WidgetState = useSelector((state) =>
    WidgetSelectors.getWidget(state),
  );
  const dispatch = useDispatch();

  const sources: string[] = [];
  const targets: string[] = [];

  const setSelectedEdges = (edges: IEdge[]): number => {
    const edgeInformation: EdgeInformation[] = edges.map(
      (selectedEdge: IEdge) => {
        const edgeID: string = selectedEdge.get('model').id;
        const edge = graphVisible.edges.find((graphEdge: IUserEdge) => {
          return edgeID === graphEdge.id;
        });

        const sourceID: string = selectedEdge.getSource().getID();
        sources.push(sourceID);
        const sourceNode = searchNodes(sourceID);

        const targetID: string = selectedEdge.getTarget().getID();
        targets.push(targetID);
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

  const setSelectedNodes = (nodes: INode[], edgeLength: number): number => {
    const sourceAndTargets: string[] = uniq([...sources, ...targets]);

    if (edgeLength === 0) {
      const selectedNodes = nodes.map((node: INode) => {
        const nodeID: string = node.get('model').id;
        return searchNodes(nodeID);
      });

      updateNodeResults(selectedNodes);
      return selectedNodes.length;
    }

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
      const selectEdgeWithMouseEvent = graph.findAllByState(
        'edge',
        'selected',
      ) as unknown as IEdge[];

      const selectNodeWithMouseEvent = graph.findAllByState(
        'node',
        'selected',
      ) as unknown as INode[];

      if (selectNodeWithMouseEvent.length === 0) return;
      const selectedEdgesLength = setSelectedEdges(selectEdgeWithMouseEvent);
      const selectedNodesLength = setSelectedNodes(
        selectNodeWithMouseEvent,
        selectedEdgesLength,
      );
      setPagination(selectedNodesLength, selectedEdgesLength);

      if (widget.main !== 'search') {
        dispatch(WidgetSlices.updateWidget({ key: 'main', id: 'search' }));
      }
    };

    graph.on('nodeselectchange', displayPropertyInformation);

    return (): void => {
      graph.off('nodeselectchange', displayPropertyInformation);
    };
  }, [graph, graphVisible, widget.main]);

  return null;
};

export default DisplaySelectedProperty;
