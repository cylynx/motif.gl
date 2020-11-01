// @ts-nocheck
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { processGraphResponse } from './graph-slice';

export type Selection = {
  label: string;
  id: string;
  type: string;
  selected: boolean;
};

export interface UiState {
  name: string;
  loading: boolean;
  modal: { isOpen: boolean; content: 'import' | string };
  clickedId: any;
  score: any;
  nodeSelection: Selection[];
  edgeSelection: Selection[];
}

const initialState: UiState = {
  name: '',
  currency: '',
  loading: false,
  modal: { isOpen: true, content: 'import' },
  clickedId: null,
  score: null,
  nodeSelection: [{ label: 'id', id: 'id', type: 'string', selected: true }],
  edgeSelection: [
    { label: 'id', id: 'id', type: 'string', selected: true },
    { label: 'source', id: 'source', type: 'string', selected: true },
    { label: 'target', id: 'target', type: 'string', selected: true },
  ],
};

const ui = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    fetchBegin(state) {
      state.loading = true;
      state.modal.content = '';
      state.modal.isOpen = false;
    },
    fetchError(state, action) {
      state.loading = false;
      state.modal.content = '';
      state.modal.isOpen = true;
    },
    fetchDone(state) {
      state.loading = false;
    },
    closeModal(state) {
      state.modal.isOpen = false;
    },
    openImportModal(state) {
      state.modal.isOpen = true;
      state.modal.content = 'import';
    },
    openDataTableModal(state, action: PayloadAction<string>) {
      state.modal.isOpen = true;
      state.modal.content = action.payload;
    },
    postMessage(state, action) {
      state.modal.isOpen = true;
      state.modal.content = action.payload;
    },
    setClickedId(state, action) {
      const id = action.payload;
      state.clickedId = id;
    },
    setScore(state, action) {
      state.score = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    updateNodeSelection(
      state,
      action: PayloadAction<{ index: number; status: boolean }>,
    ) {
      const { index, status } = action.payload;
      state.nodeSelection[index].selected = status;
    },
    updateEdgeSelection(
      state,
      action: PayloadAction<{ index: number; status: boolean }>,
    ) {
      const { index, status } = action.payload;
      state.edgeSelection[index].selected = status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(processGraphResponse, (state, action) => {
      const { data } = action.payload;
      const currentNodeFields = state.nodeSelection.map((x) => x.id);
      const currentEdgeFields = state.edgeSelection.map((x) => x.id);
      for (const field of data.metadata.fields.nodes) {
        if (!currentNodeFields.includes(field.name)) {
          state.nodeSelection.push({
            label: field.name,
            id: field.name,
            type: field.type,
            selected: false,
          });
        }
      }
      for (const field of data.metadata.fields.edges) {
        if (!currentEdgeFields.includes(field.name)) {
          state.edgeSelection.push({
            label: field.name,
            id: field.name,
            type: field.type,
            selected: false,
          });
        }
      }
    });
  },
});

export const {
  fetchBegin,
  fetchError,
  fetchDone,
  closeModal,
  openImportModal,
  openDataTableModal,
  postMessage,
  setClickedId,
  setName,
  updateNodeSelection,
  updateEdgeSelection,
} = ui.actions;

export default ui.reducer;
