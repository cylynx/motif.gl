import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Value } from 'baseui/select';
import get from 'lodash/get';
import { GraphData, GraphSelectors, Node } from '../../../../redux/graph';

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

  const searchNodes = (searchCase: string, accessor = 'id'): Node[] => {
    const node: Node[] = graphVisible.nodes.filter((node: Node) => {
      const nodeProperty: string = get(node, accessor, '');

      return nodeProperty === searchCase;
    });

    return node;
  };

  return { nodeOptions, searchNodes };
};

export default useGraphSearch;
