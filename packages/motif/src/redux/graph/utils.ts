import { uniq, get } from 'lodash';
import * as T from './types';

const findDuplicateItem = (items: string[]) => {
  const result = new Set(
    items.filter(
      (value: string, index: number, iteratee: string[]) =>
        iteratee.indexOf(value) !== index,
    ),
  );

  return Array.from(result);
};

export const findDuplicateID = (
  graphData: T.GraphData,
  accessors: T.Accessors,
): string[] => {
  const { nodes, edges } = graphData;
  const { nodeID, edgeID } = accessors;

  // motif help elimiate duplicate node/edge id,
  // thus we only cross check id between nodes and edges.
  const nodeIDAccessor = nodeID === 'auto-generate' ? 'id' : nodeID;
  const edgeIDAccessor = nodeID === 'auto-generate' ? 'id' : edgeID;
  const nodeIds: string[] = uniq(
    nodes.map((node) => get(node, nodeIDAccessor)),
  );
  const edgeIds: string[] = uniq(
    edges.map((edge) => get(edge, edgeIDAccessor)),
  );

  const ids = [...nodeIds, ...edgeIds];
  const duplicateItems = findDuplicateItem(ids);

  return duplicateItems;
};
