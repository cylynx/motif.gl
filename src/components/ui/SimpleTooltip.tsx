import React from 'react';

import { LabelSmall } from 'baseui/typography';
import { StatefulPopover, PLACEMENT, TRIGGER_TYPE } from 'baseui/popover';
// @ts-ignore
import { PopoverPlacementT } from 'baseui/popover/types';

type SimpleTooltipProps = {
  tooltip: string;
  title?: string;
  children?: React.ReactNode;
  placement?: PopoverPlacementT;
};

const SimpleTooltip = ({
  title,
  tooltip,
  placement = PLACEMENT.top,
  children,
}: SimpleTooltipProps) => {
  return (
    <StatefulPopover
      content={<LabelSmall padding='scale300'>{tooltip}</LabelSmall>}
      placement={placement}
      triggerType={TRIGGER_TYPE.hover}
      showArrow
      ignoreBoundary
    >
      {title || children}
    </StatefulPopover>
  );
};

export default SimpleTooltip;
