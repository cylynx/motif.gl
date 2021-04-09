import { Notification } from 'baseui/notification';
import React, { FC } from 'react';

export type BaseNotificationProps = { kind?: 'negative' | 'positive' };
const BaseNotification: FC<BaseNotificationProps> = ({ kind, children }) => {
  return (
    <Notification
      kind={kind}
      closeable
      overrides={{
        Body: {
          style: {
            width: '96%',
            textAlign: 'center',
          },
        },
      }}
    >
      {children}
    </Notification>
  );
};

export default BaseNotification;
