import { IToaster, ToastProps } from 'baseui/toast';
import { ReactNode, ReactText } from 'react';

export interface UIState {
  name: string;
  currency: string;
  loading: boolean;
  modal: ModalState;
  score: any;
  toast: ToastState;
  importError: Error;
}

export type NullableReactNode = ReactNode | null;
export type NullableReactText = ReactText | null;
export type ToastKind =
  | 'positive'
  | 'negative'
  | 'info'
  | 'warning'
  | undefined;
export type ToastMethods = {
  [key: string]: IToaster;
};
export type ToastState = {
  key?: NullableReactText;
  message?: ReactNode;
  props?: ToastProps;
};

export type ModalState = {
  isOpen: boolean;
  content: 'import' | string;
};

export type ShowToastAction = string | number;
