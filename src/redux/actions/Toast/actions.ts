import { ToastProps, toaster } from 'baseui/toast';
import { ReactNode } from 'react';
import { getUI } from '../../combine-reducers';
import { NullableReactText, ToastKind } from './types';
import { removeToast, updateToast } from '../../ui-slice';

const DEFAULT_TOAST_PROPS: ToastProps = {
  autoHideDuration: 3500,
};

export const show = (
  message: ReactNode,
  kind: ToastKind,
  props: ToastProps = DEFAULT_TOAST_PROPS,
) => (dispatch: any) => {
  let toastKey: NullableReactText;

  switch (kind) {
    case 'info':
      toastKey = toaster.info(message, props);
      break;
    case 'negative':
      toastKey = toaster.negative(message, props);
      break;
    case 'positive':
      toastKey = toaster.positive(message, props);
      break;
    case 'warning':
      toastKey = toaster.warning(message, props);
      break;
    default:
      toastKey = toaster.info(message, props);
      break;
  }

  dispatch(updateToast(toastKey));
};

export const remove = () => (dispatch: any, getState: any) => {
  const { toast } = getUI(getState());

  if (toast.key) {
    toaster.clear(toast.key);
    dispatch(removeToast);
  }
};
