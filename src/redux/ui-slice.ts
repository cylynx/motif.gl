// @ts-nocheck
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toaster, ToastProps } from 'baseui/toast';
import { ModalState, ShowToastAction, ToastState } from './types';

export interface UiState {
  name: string;
  loading: boolean;
  modal: ModalState;
  score: any;
  toast: ToastState;
}

const DEFAULT_TOAST_PROPS: ToastProps = {
  autoHideDuration: 3500,
};

export const initialStateUi: UiState = {
  name: 'Motif',
  currency: '',
  loading: false,
  modal: { isOpen: true, content: 'import' },
  score: null,
  toast: {},
};

const ui = createSlice({
  name: 'ui',
  initialState: initialStateUi,
  reducers: {
    fetchBegin(state) {
      state.loading = true;
      state.modal.content = '';
      state.modal.isOpen = false;
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
    updateToast(state, action: PayloadAction<ShowToastAction>) {
      state.toast = action.payload;
    },
    removeToast(state, action) {
      state.toast = null;
    },
  },
});

export const {
  fetchBegin,
  fetchDone,
  closeModal,
  openImportModal,
  openDataTableModal,
  setName,
  updateToast,
  removeToast,
} = ui.actions;

export default ui.reducer;
