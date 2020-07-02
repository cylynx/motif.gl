import { combineReducers } from '@reduxjs/toolkit';
import undoable, { excludeAction } from 'redux-undo';
import uiReducer from './uiSlice';
import graphReducer, { setRange, setGetFns } from './graphSlice';

// History group that collapses both actions into 1 undo/redo
const undoGroup = (action, currentState, previousHistory) => {
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
  filter: excludeAction(setRange.type, setGetFns.type),
  groupBy: undoGroup,
});

// Export combined reducers
export const investigateReducer = combineReducers({
  ui: uiReducer,
  graph: graphReducerHistory,
});

// Export all actions and accessors
export * from './uiSlice';
export * from './graphSlice';
export * from './accessors';
