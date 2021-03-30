import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TFileContentState } from './types';

const initialState: TFileContentState = {
  attachments: [],
  dataType: null,
  accessors: { nodeID: null, edgeID: null, edgeSource: null, edgeTarget: null },
  groupEdge: null,
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
  resetState,
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
