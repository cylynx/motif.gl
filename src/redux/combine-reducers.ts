import { combineReducers, createSelector } from '@reduxjs/toolkit';
import undoable, { excludeAction, GroupByFunction } from 'redux-undo';
import produce from 'immer';
import * as Graph from '../containers/Graph/types';
import uiReducer from './ui-slice';
import widgetReducer from '../containers/widgets/widget-slice';
import graphReducer, { GraphState, setAccessors } from './graph-slice';
import { deriveVisibleGraph, filterGraph } from '../utils/graph-utils';
import { FilterOptions, GraphData } from '../containers/Graph/types';

// History group that collapses both actions into 1 undo/redo
const undoGroup: GroupByFunction<GraphState> = (
  action,
  _currentState,
  previousHistory,
) => {
  switch (action.type) {
    case 'graph/processGraphResponse':
      return previousHistory.group;
    case 'graph/addQuery':
      if (previousHistory.group !== null) {
        return `addDataGroup${previousHistory.past.length}`;
      }
      return 'addDataGroup';
    default:
      return null;
  }
};

// Enhanced graph reducer
const graphReducerHistory = undoable(graphReducer, {
  filter: excludeAction([setAccessors.type]),
  groupBy: undoGroup,
});

// Export combined reducers
export const investigateReducer = combineReducers({
  ui: uiReducer,
  widget: widgetReducer,
  graph: graphReducerHistory,
});

export type RootState = ReturnType<typeof investigateReducer>;

// Redux helper accessors
// Map from from client's combined Reducer - use investigate as default for now
type CombinedReducer = any;
const clientState = (state: CombinedReducer): RootState => state.investigate;

export const getUI = (state: CombinedReducer) => clientState(state).ui;
export const getWidget = (state: CombinedReducer) => clientState(state).widget;
export const getGraph = (state: CombinedReducer) =>
  clientState(state).graph.present;
export const getAccessors = (state: CombinedReducer): Graph.Accessors =>
  clientState(state).graph.present.accessors;
export const getGraphList = (state: CombinedReducer): Graph.GraphList =>
  clientState(state).graph.present.graphList;
export const getGraphFlatten = (state: CombinedReducer): Graph.GraphData =>
  clientState(state).graph.present.graphFlatten;
export const getStyleOptions = (state: CombinedReducer): Graph.StyleOptions =>
  clientState(state).graph.present.styleOptions;
export const getFilterOptions = (state: CombinedReducer): Graph.FilterOptions =>
  clientState(state).graph.present.filterOptions;

export const getGraphFiltered = createSelector(
  [getGraphFlatten, getFilterOptions],
  (graphFlatten: GraphData, filterOptions: FilterOptions) => {
    const graphFiltered = produce(graphFlatten, (draftState) => {
      filterGraph(draftState, filterOptions);
    });

    return graphFlatten;
  },
);

// Selector to derive visible data
export const getGraphVisible = createSelector(
  [getGraphFlatten, getStyleOptions],
  (graphFlatten, styleOptions) => {
    const graphVisible = produce(graphFlatten, (draftState) => {
      deriveVisibleGraph(draftState, styleOptions);
    });
    return graphVisible;
  },
);

// Selector to obtain filter options
