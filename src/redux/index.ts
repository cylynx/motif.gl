import { combineReducers } from '@reduxjs/toolkit';
import undoable, { excludeAction, GroupByFunction } from 'redux-undo';
import accessorsReducer from './accessors-slice';
import uiReducer from './ui-slice';
import graphReducer, { setRange, GraphState } from './graph-slice';

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
  filter: excludeAction([setRange.type]),
  groupBy: undoGroup,
});

// Export combined reducers
export const investigateReducer = combineReducers({
  ui: uiReducer,
  accessors: accessorsReducer,
  graph: graphReducerHistory,
});

export type RootState = ReturnType<typeof investigateReducer>;

// Redux helper accessors
// Map from from client's combined Reducer - use investigate as default for now
type CombinedReducer = any;
const clientState = (state: CombinedReducer): RootState => state.investigate;

export const getUI = (state: CombinedReducer) => clientState(state).ui;
export const getGraph = (state: CombinedReducer) =>
  clientState(state).graph.present;
export const getAccessors = (state: CombinedReducer) =>
  clientState(state).accessors;

// Export all actions and accessors
export * from './ui-slice';
export * from './graph-slice';
export * from './accessors-slice';
