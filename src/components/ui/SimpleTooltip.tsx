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

/*
 * @see
 * https://popper.js.org/docs/v1/#modifiers..hide.enabled
 * https://baseweb.design/components/tooltip#tooltip-stateful-example
 *
 * Remove warnings in console
 * 1. Enabled popper modifier
 * 2. Enabled prevent overflow configurations
 */
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
      popperOptions={{
        modifiers: {
          preventOverflow: {
            enabled: true,
          },
          hide: {
            enabled: true,
          },
        },
      }}
    >
      {title || children}
    </StatefulPopover>
  );
};

export default SimpleTooltip;
