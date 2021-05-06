import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TFileContentState } from './types';

export const initialState: TFileContentState = {
  step: 1,
  attachments: [],
  dataType: 'json',
  accessors: {
    nodeID: 'id',
    edgeID: 'id',
    edgeSource: 'source',
    edgeTarget: 'target',
  },
  groupEdge: true,
  dataPreview: {
    nodes: [],
    edges: [],
    metadata: { fields: { nodes: [], edges: [] } },
  },
  isEdgeGroupable: false,
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
    setIsEdgeGroupable(
      state: TFileContentState,
      action: PayloadAction<TFileContentState['isEdgeGroupable']>,
    ): TFileContentState {
      return {
        ...state,
        isEdgeGroupable: action.payload,
      };
    },
    setStep(
      state: TFileContentState,
      action: PayloadAction<number>,
    ): TFileContentState {
      return {
        ...state,
        step: action.payload,
      };
    },
    resetDataPreview(state: TFileContentState) {
      Object.assign(state, {
        dataPreview: initialState.dataPreview,
      });
    },
    resetState(state: TFileContentState) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setAttachments,
  setDataType,
  setAccessors,
  setGroupEdge,
  setDataPreview,
  setIsEdgeGroupable,
  setStep,
  resetState,
  resetDataPreview,
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
