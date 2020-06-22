import {
    configureStore,
    combineReducers,
    getDefaultMiddleware,
  } from '@reduxjs/toolkit';
  import undoable, { excludeAction } from 'redux-undo';
  
  import graphInitReducer from './graphInitSlice';
  import graphReducer, {
    setRange,
  } from './graphSlice';
  
  // History group to collapse both actions into 1 undo/redo
  const group = (action, currentState, previousHistory) => {
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
  
  // Redux thunk is automatically added as default middleware
  // graphReducer is enhanced with undo & redo functions
  const store = configureStore({
    reducer: combineReducers({
      graphInit: graphInitReducer,
      graph: undoable(graphReducer, {
        filter: excludeAction([setRange.type]),
        groupBy: group,
      }),
    }),
    middleware: getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  });
  
  export default store;
  