import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, ShowToastAction } from './types';

export const initialStateUi: UIState = {
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
    setContainerId(state, action: PayloadAction<string>): void {
      Object.assign(state, {
        containerId: action.payload,
      });
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
  setContainerId,
} = ui.actions;

export default ui.reducer;
