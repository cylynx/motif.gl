import { combineReducers } from '@reduxjs/toolkit';
import undoable, { excludeAction, GroupByFunction } from 'redux-undo';
import uiReducer from './ui-slice';
import graphReducer, { setRange, setAccessorFns, GraphState } from './graph-slice';

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
  filter: excludeAction([setRange.type, setAccessorFns.type]),
  groupBy: undoGroup,
});

// Export combined reducers
export const investigateReducer = combineReducers({
  ui: uiReducer,
  graph: graphReducerHistory,
});

// Export all actions and accessors
export * from './ui-slice';
export * from './graph-slice';
export * from './accessors';
