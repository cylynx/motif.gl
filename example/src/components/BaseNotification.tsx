import { Notification } from 'baseui/notification';
import React, { FC } from 'react';
import { Theme } from 'baseui/theme';

export type BaseNotificationProps = {
  kind?: 'negative' | 'positive' | 'info';
  height?: string;
};
const BaseNotification: FC<BaseNotificationProps> = ({
  kind,
  height = 'auto',
  children,
}) => {
  return (
    <Notification
      kind={kind}
      overrides={{
        Body: {
          style: ({ $theme }: { $theme: Theme }) => ({
            width: '98%',
            textAlign: 'center',
            paddingTop: $theme.sizing.scale300,
            paddingLeft: $theme.sizing.scale300,
            paddingRight: $theme.sizing.scale300,
            paddingBottom: $theme.sizing.scale300,
            height: height,
            overflowX: 'hidden',
          }),
        },
        InnerContainer: {
          style: {
            fontSize: '14px',
            width: '100%',
            alignSelf: 'center',
          },
        },
      }}
    >
      {children}
    </Notification>
  );
};

export default BaseNotification;
