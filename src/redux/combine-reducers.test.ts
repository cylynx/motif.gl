// @ts-nocheck
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