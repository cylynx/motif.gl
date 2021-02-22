import { useContext, useLayoutEffect } from 'react';
import { INode } from '@antv/g6';
import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
  NodeConfig,
} from '@antv/graphin';
import { useSelector } from 'react-redux';
import { GraphSelectors } from '../../../redux/graph';
import useSearchOption from '../../SidePanel/SearchPanel/hooks/useSearchOption';

const DisplaySelectedProperty = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  const { displayNodeInformation } = useSearchOption();
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );

  useLayoutEffect(() => {
    const displayPropertyInformation = (_: IG6GraphEvent): void => {
      // if no node is selected. doesn't require to compute everything.
      const selectedNode: INode[] = graph.findAllByState('node', 'selected');
      if (selectedNode.length === 0) return;

      const selectedNodeConfig: NodeConfig[] = selectedNode.map(
        (node: INode) => {
          const nodeConfig: NodeConfig = node.get('model');
          return nodeConfig;
        },
      );

      displayNodeInformation(selectedNodeConfig);

      console.log(graphVisible);

      // const selectedEdge = graph.findAllByState('edge', 'selected');
    };

    graph.on('nodeselectchange', displayPropertyInformation);

    return (): void => {
      graph.off('nodeselectchange', displayPropertyInformation);
    };
  }, [graphVisible]);

  return null;
};

export default DisplaySelectedProperty;
