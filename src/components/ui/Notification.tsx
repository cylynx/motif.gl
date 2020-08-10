import * as React from 'react';
import { Notification as BaseNotification } from 'baseui/notification';
import { ToastProps } from 'baseui/toast';

type NotificationProps = ToastProps & {
  children: React.ReactNode;
  width?: string | number | string;
};

const Notification = ({
  children,
  width = 'auto',
  ...rest
}: NotificationProps) => (
  <BaseNotification
    overrides={{
      Body: { style: { width } },
    }}
    {...rest}
  >
    {children}
  </BaseNotification>
);

export default Notification;
