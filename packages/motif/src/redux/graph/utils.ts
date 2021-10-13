import { get } from 'lodash';
import { MotifImportError } from '../../components/ImportErrorMessage';
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
): void => {
  const { nodes, edges } = graphData;
  const { nodeID = 'id', edgeID = 'id' } = accessors;

  const nodeIDAccessor = nodeID === 'auto-generate' ? 'id' : nodeID;
  const edgeIDAccessor = edgeID === 'auto-generate' ? 'id' : edgeID;
  const nodeIds = nodes.map((node) => get(node, nodeIDAccessor));
  const edgeIds = edges.map((edge) => get(edge, edgeIDAccessor));

  const duplicateNodeIds = findDuplicateItem(nodeIds);
  if (duplicateNodeIds.length > 0) {
    const message = JSON.stringify(duplicateNodeIds);
    throw new MotifImportError('conflict-node-id', message);
  }

  const duplicateEdgeIds = findDuplicateItem(edgeIds);
  if (duplicateEdgeIds.length > 0) {
    const message = JSON.stringify(duplicateEdgeIds);
    throw new MotifImportError('conflict-edge-id', message);
  }

  const ids = [...nodeIds, ...edgeIds];
  const duplicateItems = findDuplicateItem(ids);
  if (duplicateItems.length > 0) {
    const message = JSON.stringify(duplicateItems);
    throw new MotifImportError('node-edge-id-conflicts', message);
  }
};
