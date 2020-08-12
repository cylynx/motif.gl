import graph, { addQuery, updateGraph, timeRangeChange } from './graph-slice';
import testNeighbourData from '../../constants/testNeighbourData.json';
import testNeighbourData2 from '../../constants/testNeighbourData2.json';

const initialState = {
  graphList: [],
  graphFlatten: [],
  timeRange: [],
  graphVisible: [],
};

describe('graph reducer', () => {
  // it('should handle initial state', () => {
  //   expect(graph(undefined, {})).toEqual(initialState);
  // });

  it('should handle addQuery', () => {
    const results = graph(initialState, {
      type: addQuery.type,
      payload: testNeighbourData,
    });
    expect(results.graphList).toHaveLength(1);
    expect(results.graphList).toEqual([testNeighbourData]);
  });

  it('should update graph when given new nodes and edges array', () => {
    const results = graph(
      {
        graphFlatten: {
          nodes: [{ id: 'n1' }],
          edges: [{ id: 'e1' }],
        },
      },
      {
        type: updateGraph.type,
        payload: {
          graphName: 'graphFlatten',
          newNodes: [{ id: 'n2' }],
          newEdges: [{ id: 'e2' }],
        },
      }
    );
    expect(results.graphFlatten).toEqual({
      nodes: [{ id: 'n2' }],
      edges: [{ id: 'e2' }],
    });
  });

  it('should not update node/edge if given empty array', () => {
    const results = graph(
      {
        graphFlatten: {
          nodes: [{ id: 'n1' }],
          edges: [{ id: 'e1' }],
        },
      },
      {
        type: updateGraph.type,
        payload: {
          graphName: 'graphFlatten',
          newNodes: [{ id: 'n2' }],
          newEdges: [],
        },
      }
    );
    expect(results.graphFlatten).toEqual({
      nodes: [{ id: 'n2' }],
      edges: [{ id: 'e1' }],
    });
  });

  it('should not update node/edge if missing', () => {
    const results = graph(
      {
        graphFlatten: {
          nodes: [{ id: 'n1' }],
          edges: [{ id: 'e1' }],
        },
      },
      {
        type: updateGraph.type,
        payload: {
          graphName: 'graphFlatten',
          newNodes: [{ id: 'n2' }],
        },
      }
    );
    expect(results.graphFlatten).toEqual({
      nodes: [{ id: 'n2' }],
      edges: [{ id: 'e1' }],
    });
  });

  it('should filter timerange correctly', () => {
    const results = graph(
      {
        graphVisible: {},
        graphFlatten: {
          nodes: [{ id: 'n1' }, { id: 'n2' }, { id: 'n3' }],
          edges: [
            { id: 'e1', from: 'n1', to: 'n2', data: { blk_ts_unix: 3 } },
            { id: 'e1', from: 'n2', to: 'n3', data: { blk_ts_unix: 6 } },
          ],
        },
      },
      {
        type: timeRangeChange.type,
        payload: [5, 10],
      }
    );
    expect(results.graphVisible).toEqual({
      nodes: [{ id: 'n2' }, { id: 'n3' }],
      edges: [{ id: 'e1', from: 'n2', to: 'n3', data: { blk_ts_unix: 6 } }],
    });
  });
});
