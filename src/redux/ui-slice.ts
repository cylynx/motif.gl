// @ts-nocheck
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Tooltip = null | {
  id: string;
  x: number;
  y: number;
  type: 'edge' | 'node';
};

export interface UiState {
  name: string;
  loading: boolean;
  modal: { isOpen: boolean; content: 'import' | string };
  tooltip: Tooltip;
  score: any;
}

const initialState: UiState = {
  name: '',
  currency: '',
  loading: false,
  modal: { isOpen: true, content: 'import' },
  tooltip: null,
  score: null,
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
    fetchError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.modal.content = action.payload;
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
    setTooltip(state, action: PayloadAction<Tooltip>) {
      state.tooltip = action.payload;
    },
    setScore(state, action) {
      state.score = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
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
  setTooltip,
  setName,
} = ui.actions;

export default ui.reducer;
