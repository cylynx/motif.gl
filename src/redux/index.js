import graphInitReducer from './graphInitSlice';
import graphReducer, {
  setRange,
} from './graphSlice';
  
// Export 2 reducers and action
export {
  graphInitReducer,
  graphReducer,
  setRange,
};

// Export history group that collapses both actions into 1 undo/redo
export const undoGroup = (action, currentState, previousHistory) => {
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