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
 * https://popper.js.org/docs/v1/#modifiers..preventOverflow.boundariesElement
 *
 * Remove warnings in console
 * 1. Configure preventOverflow to true in popper modifier as it is required by hide.
 * 2. Configure boundariesElement to "viewport" to support popper's placement.
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
            boundariesElement: 'viewport',
          },
          hide: {
            enabled: false,
          },
        },
      }}
    >
      {title || children}
    </StatefulPopover>
  );
};

export default SimpleTooltip;
