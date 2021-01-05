// @ts-nocheck
import { combineReducers } from '@reduxjs/toolkit';
import { Graph } from '@antv/graphin/dist';
import { initialState as initialStateGraph } from './graph-slice';
import { initialStateUi } from './ui-slice';
import {
  investigateReducer,
  getUI,
  getGraph,
  getStyleOptions,
  getGraphList,
  getGraphFlatten,
  getGraphVisible,
  getFilterOptions,
} from './combine-reducers';

const clientReducer = combineReducers({
  investigate: investigateReducer,
});

describe('selectors', () => {
  it('initial selectors should be valid', async () => {
    const results = clientReducer({}, {});
    expect(getUI(results)).toEqual(initialStateUi);
    expect(getGraph(results)).toEqual(initialStateGraph);
    expect(getGraphList(results)).toEqual(initialStateGraph.graphList);
    expect(getGraphFlatten(results)).toEqual(initialStateGraph.graphFlatten);
    expect(getStyleOptions(results)).toEqual(initialStateGraph.styleOptions);
    expect(getGraphVisible(results)).toEqual(initialStateGraph.graphFlatten);
    expect(getFilterOptions(results)).toEqual(initialStateGraph.filterOptions);
  });

  describe('getGraphFiltered', () => {
    const mockGraphFlatten: Graph.GraphData = {
      nodes: [
        { id: 'node-1' },
        { id: 'node-2' },
        { id: 'node-3' },
        { id: 'node-4' },
      ],
      edges: [
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
        { id: 'edge-2', source: 'node-3', target: 'node-4' },
      ],
      metadata: {
        fields: {
          nodes: [
            {
              name: 'id',
              format: '',
              type: 'string',
              analyzerType: 'STRING',
            },
          ],
          edges: [
            {
              name: 'id',
              format: '',
              type: 'string',
              analyzerType: 'STRING',
            },
            {
              name: 'source',
              format: '',
              type: 'string',
              analyzerType: 'STRING',
            },
            {
              name: 'target',
              format: '',
              type: 'string',
              analyzerType: 'STRING',
            },
          ],
        },
      },
    };

    const mockGraphFiltered = {
      firstKey: {},
    };

    it('getGraphFiltered should filter node properties', () => {});
  });
});
