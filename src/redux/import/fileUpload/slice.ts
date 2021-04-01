import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TFileContentState } from './types';

const initialState: TFileContentState = {
  attachments: [],
  dataType: 'json',
  accessors: {
    nodeID: 'id',
    edgeID: 'id',
    edgeSource: 'source',
    edgeTarget: 'target',
  },
  groupEdge: null,
  dataPreview: {
    nodes: [],
    edges: [],
    metadata: { fields: { nodes: [], edges: [] } },
  },
};

const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState,
  reducers: {
    setAttachments(
      state: TFileContentState,
      action: PayloadAction<TFileContentState['attachments']>,
    ): TFileContentState {
      return {
        ...state,
        attachments: action.payload,
      };
    },
    setDataType(
      state: TFileContentState,
      action: PayloadAction<TFileContentState['dataType']>,
    ): TFileContentState {
      return {
        ...state,
        dataType: action.payload,
      };
    },
    setAccessors(
      state: TFileContentState,
      action: PayloadAction<TFileContentState['accessors']>,
    ): TFileContentState {
      return {
        ...state,
        accessors: action.payload,
      };
    },
    setGroupEdge(
      state: TFileContentState,
      action: PayloadAction<TFileContentState['groupEdge']>,
    ): TFileContentState {
      return {
        ...state,
        groupEdge: action.payload,
      };
    },
    setDataPreview(
      state: TFileContentState,
      action: PayloadAction<TFileContentState['dataPreview']>,
    ): TFileContentState {
      return {
        ...state,
        dataPreview: action.payload,
      };
    },
    resetState(): TFileContentState {
      return initialState;
    },
  },
});

export const {
  setAttachments,
  setDataType,
  setAccessors,
  setGroupEdge,
  setDataPreview,
  resetState,
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
