import React from 'react';

import {
  StatefulTooltip,
  PLACEMENT,
  StatefulTooltipProps,
} from 'baseui/tooltip';
import { Button, SHAPE } from 'baseui/button';
import { MdInfoOutline } from 'react-icons/md';

type InfoIconProps = Partial<StatefulTooltipProps> & {
  info: string;
};

const InfoIcon = ({ info, ...rest }: InfoIconProps) => {
  return (
    <StatefulTooltip
      content={info}
      placement={PLACEMENT.top}
      ignoreBoundary
      showArrow
      {...rest}
    >
      <Button
        isSelected
        shape={SHAPE.round}
        $as='div'
        overrides={{
          BaseButton: {
            style: {
              backgroundColor: 'transparent',
              paddingTop: '0px',
              paddingBottom: '0px',
            },
          },
        }}
      >
        <MdInfoOutline color='black' />
      </Button>
    </StatefulTooltip>
  );
};

export default InfoIcon;
