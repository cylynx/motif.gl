import { uniq } from 'lodash';
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

export const findDuplicateID = (graphData: T.GraphData): string[] => {
  const { nodes, edges } = graphData;

  // motif help elimiate duplicate node/edge id,
  // thus we only cross check id between nodes and edges.
  const nodeIds: string[] = uniq(nodes.map((node) => node.id));
  const edgeIds: string[] = uniq(edges.map((edge) => edge.id));

  const ids = [...nodeIds, ...edgeIds];
  const duplicateItems = findDuplicateItem(ids);

  return duplicateItems;
};
