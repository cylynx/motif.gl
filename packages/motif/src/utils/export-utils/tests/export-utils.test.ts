import { setGraphListPosition } from '../export-utils';
import { stateWithoutPosition, stateWithPosition } from './constant';

describe('Export File Utilities', () => {
  describe('setGraphListPosition', () => {
    it('should attach the node position from graphFlatten to graphList', () => {
      const { graphList, graphFlatten } = stateWithPosition;
      const graphListWithPos = setGraphListPosition(graphList, graphFlatten);

      const expectedGraphList = [
        {
          nodes: [
            { id: 'node-1', x: 1, y: 1 },
            { id: 'node-2', x: 2, y: 2 },
          ],
          edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
        },
        {
          nodes: [
            { id: 'node-3', x: 3, y: 3 },
            { id: 'node-4', x: 4, y: 4 },
          ],
          edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
        },
        {
          nodes: [
            { id: 'node-5', x: 5, y: 5 },
            { id: 'node-6', x: 6, y: 6 },
          ],
          edges: [{ id: 'edge-3', source: 'node-5', target: 'node-6' }],
        },
      ];

      expect(graphListWithPos).toEqual(expectedGraphList);
    });
  });

  it('should return original graphList when graphFlatten no position', () => {
    const { graphList, graphFlatten } = stateWithoutPosition;
    const graphListWithPos = setGraphListPosition(graphList, graphFlatten);

    expect(graphListWithPos).toEqual(graphList);
  });
});
