import { useContext, useLayoutEffect } from 'react';
import { INode, IEdge } from '@antv/g6';
import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@antv/graphin';
import { useSelector } from 'react-redux';
import { IUserEdge, IUserNode } from '@antv/graphin/lib/typings/type';
import uniq from 'lodash/uniq';
import { GraphSelectors } from '../../../redux/graph';
import useSearchOption from '../../SidePanel/SearchPanel/hooks/useSearchOption';
import { removeDuplicates } from '../styles/utils';

const DisplaySelectedProperty = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  // const { appendSelectedItems } = useSearchOption();
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );

  const appendSelectedNodeResult = () => {
    const selectedNode: INode[] = graph.findAllByState('node', 'selected');
    if (selectedNode.length === 0) return;

    const selectedNodeIds: string[] = selectedNode.map((node: INode) => {
      const nodeId: string = node.get('model').id;
      return nodeId;
    });

    const selectedNodes = graphVisible.nodes.filter((node: IUserNode) => {
      return selectedNodeIds.includes(node.id);
    });

    // appendSelectedItems(selectedNodes);
  };

  const appendSelectedEdgeResult = () => {
    const selectedEdge: IEdge[] = graph.findAllByState('edge', 'selected');
    if (selectedEdge.length === 0) return;

    const selectedEdgeIds: string[] = selectedEdge.map((edge: IEdge) => {
      const edgeID: string = edge.get('model').id;
      return edgeID;
    });

    const selectedEdges = graphVisible.edges.filter((edge: IUserEdge) => {
      return selectedEdgeIds.includes(edge.id);
    });

    // appendSelectedItems(selectedEdges);
  };

  useLayoutEffect(() => {
    const displayPropertyInformation = (_: IG6GraphEvent): void => {
      // appendSelectedNodeResult();
      // appendSelectedEdgeResult();

      // obtain selected edges
      const selectEdgeWithMouseEvent: IEdge[] = graph.findAllByState(
        'edge',
        'selected',
      );
      if (selectEdgeWithMouseEvent.length === 0) return;

      const selectedEdgeIds: string[] = [];
      let sources: string[] = [];
      let targets: string[] = [];

      selectEdgeWithMouseEvent.forEach((edge: IEdge) => {
        const edgeID: string = edge.get('model').id;
        selectedEdgeIds.push(edgeID);

        const source: INode = edge.getSource();
        const sourceID: string = source.getID();
        sources.push(sourceID);

        const target: INode = edge.getTarget();
        const targetID: string = target.getID();
        targets.push(targetID);
      });

      // eliminate duplicate strings
      sources = uniq(sources);
      targets = uniq(targets);

      const selectedEdges = graphVisible.edges.filter((edge: IUserEdge) => {
        return selectedEdgeIds.includes(edge.id);
      });
      //
      // // obtain selected nodes
      // const selectNodeWithMouseEvent: INode[] = graph.findAllByState(
      //   'node',
      //   'selected',
      // );
      // if (selectNodeWithMouseEvent.length === 0) return;
      //
      // const selectedNodeIds: string[] = selectNodeWithMouseEvent.map(
      //   (node: INode) => {
      //     const nodeId: string = node.get('model').id;
      //     return nodeId;
      //   },
      // );
      //
      // const selectedNodes = graphVisible.nodes.filter((node: IUserNode) => {
      //   return selectedNodeIds.includes(node.id);
      // });
      //
      // appendSelectedItems(selectedNodes);
    };

    graph.on('nodeselectchange', displayPropertyInformation);

    return (): void => {
      graph.off('nodeselectchange', displayPropertyInformation);
    };
  }, [graphVisible]);

  return null;
};

export default DisplaySelectedProperty;
