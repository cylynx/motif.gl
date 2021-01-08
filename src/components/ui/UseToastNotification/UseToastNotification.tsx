import { useState, ReactNode } from 'react';
import { toaster, ToastProps } from 'baseui/toast';
import { NullableReactText, ToastKind } from './types';

const UseToastNotification = () => {
  const [toastKey, setToastKey] = useState<NullableReactText>(null);

  const showToast = (
    message: ReactNode,
    kind: ToastKind,
    props: ToastProps = {
      autoHideDuration: 3500,
    },
  ): void => {
    switch (kind) {
      case 'info':
        setToastKey(toaster.info(message, props));
        break;
      case 'negative':
        setToastKey(toaster.negative(message, props));
        break;
      case 'positive':
        setToastKey(toaster.positive(message, props));
        break;
      case 'warning':
        setToastKey(toaster.warning(message, props));
        break;
      default:
        setToastKey(toaster.info(message, props));
        break;
    }
  };

  const closeToast = (): void => {
    if (toastKey) {
      toaster.clear(toastKey);
      setToastKey(null);
    }
  };

  return {
    toastKey,
    showToast,
    closeToast,
  };
};

export default UseToastNotification;
