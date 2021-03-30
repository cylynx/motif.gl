import { useReducer } from 'react';
import { TFileContentAction, TFileContentState } from '../types';

const initialState: TFileContentState = {
  attachments: [],
  dataType: null,
  accessors: { nodeID: null, edgeID: null, edgeSource: null, edgeTarget: null },
  groupEdge: null,
};

const fileContentReducer = (
  state: TFileContentState,
  action: TFileContentAction,
) => {
  switch (action.type) {
    case 'SET_ATTACHMENTS':
      return {
        ...state,
        attachments: action.payload as TFileContentState['attachments'],
      };
    case 'SET_DATA_TYPE':
      return {
        ...state,
        dataType: action.payload as TFileContentState['dataType'],
      };
    case 'SET_ACCESSORS':
      return {
        ...state,
        accessors: action.payload as TFileContentState['accessors'],
      };
    case 'SET_GROUP_EDGE':
      return {
        ...state,
        groupEdge: action.payload as TFileContentState['groupEdge'],
      };
    case 'RESET_STATES':
      return initialState;
    default:
      throw new Error('FileContentReducer: action not found.');
  }
};

const UseFileContent = () => {
  const [state, dispatch] = useReducer(fileContentReducer, initialState);

  const setAttachments = (attachments: TFileContentState['attachments']) => {
    dispatch({ type: 'SET_ATTACHMENTS', payload: attachments });
  };

  const setDataType = (dataType: TFileContentState['dataType']) => {
    dispatch({ type: 'SET_DATA_TYPE', payload: dataType });
  };

  const setAccessors = (accessors: TFileContentState['accessors']) => {
    dispatch({ type: 'SET_ATTACHMENTS', payload: accessors });
  };

  const setGroupEdge = (groupEdge: TFileContentState['groupEdge']) => {
    dispatch({ type: 'SET_GROUP_EDGE', payload: groupEdge });
  };

  const resetState = () => {
    dispatch({ type: 'RESET_STATES' });
  };

  console.log(state);

  return {
    state,
    setAttachments,
    setDataType,
    setAccessors,
    setGroupEdge,
    resetState,
  };
};

export default UseFileContent;
