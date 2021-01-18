import { createSelector } from '@reduxjs/toolkit';
import produce from 'immer';
import * as Graph from '../../containers/Graph/types';
import { deriveVisibleGraph, filterGraph } from '../../utils/graph-utils';

const getGraph = (state: any) => state.investigate.graph.present;
const getAccessors = (state: any): Graph.Accessors => getGraph(state).accessors;
const getGraphList = (state: any): Graph.GraphList => getGraph(state).graphList;
const getGraphFlatten = (state: any): Graph.GraphData =>
  getGraph(state).graphFlatten;
const getStyleOptions = (state: any): Graph.StyleOptions =>
  getGraph(state).styleOptions;
const getFilterOptions = (state: any): Graph.FilterOptions =>
  getGraph(state).filterOptions;

// Selector to perform filter on graph datas
const getGraphFiltered = createSelector(
  [getGraphFlatten, getFilterOptions],
  (graphFlatten: Graph.GraphData, filterOptions: Graph.FilterOptions) => {
    const graphFiltered = produce(graphFlatten, (draftState) => {
      filterGraph(draftState, filterOptions);
    });

    return graphFiltered;
  },
);

// Selector to derive visible data
const getGraphVisible = createSelector(
  [getGraphFiltered, getStyleOptions],
  (graphFiltered: Graph.GraphData, styleOptions: Graph.StyleOptions) => {
    const graphVisible = produce(graphFiltered, (draftState) => {
      deriveVisibleGraph(draftState, styleOptions);
    });
    return graphVisible;
  },
);

export {
  getGraph,
  getAccessors,
  getGraphList,
  getGraphFlatten,
  getStyleOptions,
  getFilterOptions,
  getGraphFiltered,
  getGraphVisible,
};
