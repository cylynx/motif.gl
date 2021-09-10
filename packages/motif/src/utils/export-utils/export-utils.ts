import { has, cloneDeep } from 'lodash';
import { GraphData, GraphList } from '../../redux/graph';

export const setGraphListPosition = (
  graphList: GraphList,
  graphFlatten: GraphData,
): GraphList => {
  const { nodes } = graphFlatten;

  const nodesWithPosition = nodes.filter((node) => {
    return has(node, 'x') && has(node, 'y');
  });

  if (nodesWithPosition.length === 0) return graphList;

  const nodePositionDict = nodesWithPosition.reduce((arr, node) => {
    const { id, x, y } = node;
    Object.assign(arr, {
      [id]: { x, y },
    });
    return arr;
  }, {});

  const graphListWithPosition = graphList.map((graphData) => {
    const { nodes } = graphData;

    const attachedPositionNodes = nodes.map((node) => {
      const { id } = node;

      const nodeHasPosition = has(nodePositionDict, id);
      if (!nodeHasPosition) return node;

      const nodeCoordinate = nodePositionDict[id];
      const { x, y } = nodeCoordinate;
      return { ...node, x, y };
    });

    const modData = cloneDeep(graphData);
    Object.assign(modData, {
      nodes: attachedPositionNodes,
    });

    return modData;
  });

  return graphListWithPosition;
};
