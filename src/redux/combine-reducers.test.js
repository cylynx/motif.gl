import { combineReducers } from '@reduxjs/toolkit';
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
} from './combine-reducers';
import { importJson } from '../processors/import-data';

const JsonData = {
  nodes: [{ id: 'node-1' }, { id: 'node-2' }],
  edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
  metadata: {
    key: 123,
  },
};

const JsonData2 = {
  nodes: [{ id: 'node-2' }, { id: 'node-3' }],
  edges: [{ id: 'edge-2', source: 'node-2', target: 'node-3' }],
  metadata: {
    key: 234,
  },
};

const sampleGraphList = importJson(JsonData, initialStateGraph.accessors);

const sampleGraphList2 = importJson(JsonData2, initialStateGraph.accessors);

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
  });
});
