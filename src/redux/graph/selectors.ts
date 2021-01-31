import { createSelector } from '@reduxjs/toolkit';
import produce from 'immer';
import {
  Accessors,
  GraphList,
  GraphData,
  StyleOptions,
  FilterOptions,
  GraphState,
} from './types';
import {
  deriveVisibleGraph,
  filterGraph,
} from '../../containers/Graph/styles/utils';

const getGraph = (state: any): GraphState => state.investigate.graph.present;
const getAccessors = (state: any): Accessors => getGraph(state).accessors;
const getGraphList = (state: any): GraphList => getGraph(state).graphList;
const getGraphFlatten = (state: any): GraphData => getGraph(state).graphFlatten;
const getStyleOptions = (state: any): StyleOptions =>
  getGraph(state).styleOptions;
const getFilterOptions = (state: any): FilterOptions =>
  getGraph(state).filterOptions;

// Selector to perform filter on graph datas
const getGraphFiltered = createSelector(
  [getGraphFlatten, getFilterOptions],
  (graphFlatten: GraphData, filterOptions: FilterOptions) => {
    const graphFiltered = produce(graphFlatten, (draftState: GraphData) => {
      filterGraph(draftState, filterOptions);
    });

    return graphFiltered;
  },
);

// Selector to derive visible data
const getGraphVisible = createSelector(
  [getGraphFiltered, getStyleOptions],
  (graphFiltered: GraphData, styleOptions: StyleOptions) => {
    const graphVisible = produce(graphFiltered, (draftState: GraphData) => {
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
