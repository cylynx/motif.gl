/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, ShowToastAction } from './types';

export const initialStateUi: UIState = {
  name: 'Motif',
  currency: '',
  loading: false,
  modal: { isOpen: true, content: 'import' },
  score: null,
  toast: {},
  importError: null,
};

const ui = createSlice({
  name: 'ui',
  initialState: initialStateUi,
  reducers: {
    fetchBegin(state): void {
      Object.assign(state, {
        loading: true,
        content: '',
        isOpen: false,
      });
    },
    fetchDone(state): void {
      Object.assign(state, {
        loading: false,
      });
    },
    closeModal(state): void {
      Object.assign(state.modal, {
        isOpen: false,
      });
    },
    openImportModal(state): void {
      Object.assign(state.modal, {
        isOpen: true,
        content: 'import',
      });
    },
    openDataTableModal(state, action: PayloadAction<string>): void {
      Object.assign(state.modal, {
        isOpen: true,
        content: action.payload,
      });
    },
    setName(state, action): void {
      Object.assign(state, {
        name: action.payload,
      });
    },
    updateToast(state, action: PayloadAction<ShowToastAction>): void {
      // @ts-ignore
      Object.assign(state, {
        toast: action.payload,
      });
    },
    removeToast(state): void {
      Object.assign(state, {
        toast: null,
      });
    },
    displayError: (state, action: PayloadAction<Error>) => {
      const importError = action.payload;
      state.importError = importError;
    },
    clearError: (state) => {
      state.importError = null;
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
  displayError,
  clearError,
} = ui.actions;

export default ui.reducer;
