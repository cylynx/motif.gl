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
    showToast(state, action: PayloadAction<ShowToastAction>) {
      const { message, kind, props = DEFAULT_TOAST_PROPS } = action.payload;
      switch (kind) {
        case 'info':
          state.toast.key = toaster.info(message, props);
          break;
        case 'negative':
          state.toast.key = toaster.negative(message, props);
          break;
        case 'positive':
          state.toast.key = toaster.positive(message, props);
          break;
        case 'warning':
          state.toast.key = toaster.warning(message, props);
          break;
        default:
          state.toast.key = toaster.info(message, props);
          break;
      }
    },
    closeToast(state, action) {
      if (state.toast.key) {
        toaster.clear(state.toast.key);
        state.toast = {};
      }
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
  showToast,
  closeToast,
} = ui.actions;

export default ui.reducer;
