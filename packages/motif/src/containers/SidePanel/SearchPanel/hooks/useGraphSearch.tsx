import { useMemo } from 'react';
import { useSelector } from '../../../../redux/hooks';
import { Value } from 'baseui/select';
import get from 'lodash/get';
import { GraphData, GraphSelectors, Node, Edge } from '../../../../redux/graph';

const useGraphSearch = () => {
  const graphVisible: GraphData = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );

  const nodeOptions: Value = useMemo(() => {
    return graphVisible.nodes.map((node: Node) => {
      const { id } = node;
      return {
        id,
        label: id,
      };
    });
  }, [graphVisible.nodes]);

  const edgeOptions: Value = useMemo(() => {
    return graphVisible.edges.map((edge: Edge) => {
      const { id } = edge;
      return {
        id,
        label: id,
      };
    });
  }, [graphVisible.edges]);

  const searchNodes = (searchCase: string, accessor = 'id'): Node => {
    const node: Node = graphVisible.nodes.find((node: Node) => {
      const nodeProperty: string = get(node, accessor, '');

      return (
        nodeProperty.toString().toLowerCase() ===
        searchCase.toString().toLowerCase()
      );
    });

    return node;
  };

  const searchEdges = (searchCase: string, accessor = 'id'): Edge => {
    const node: Edge = graphVisible.edges.find((edge: Edge) => {
      const nodeProperty: string = get(edge, accessor, '');

      return (
        nodeProperty.toString().toLowerCase() ===
        searchCase.toString().toLowerCase()
      );
    });

    return node;
  };

  return { nodeOptions, edgeOptions, searchNodes, searchEdges };
};

export default useGraphSearch;
