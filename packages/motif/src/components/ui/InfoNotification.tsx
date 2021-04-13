import React from 'react';

import { Block } from 'baseui/block';
import Notification from './Notification';
import InfoIcon from './InfoIcon';

type InfoNotificationProps = {
  info: string;
  tooltip: string;
};

const InfoNotification = ({ info, tooltip }: InfoNotificationProps) => {
  return (
    <Notification>
      <Block display='flex' width='100%'>
        <Block width='540px'>{info}</Block>
        <InfoIcon info={tooltip} />
      </Block>
    </Notification>
  );
};

export default InfoNotification;
