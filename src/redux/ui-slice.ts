// @ts-nocheck
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  name: string;
  loading: boolean;
  modal: { isOpen: boolean; content: 'import' | string };
  score: any;
}

export const initialState: UiState = {
  name: '',
  currency: '',
  loading: false,
  modal: { isOpen: true, content: 'import' },
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
  setName,
} = ui.actions;

export default ui.reducer;
