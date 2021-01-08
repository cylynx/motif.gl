import { IToaster } from 'baseui/toast';
import { ReactNode, ReactText } from 'react';

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
