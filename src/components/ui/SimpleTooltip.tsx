import React from 'react';
import { StatefulTooltip, PLACEMENT, TRIGGER_TYPE } from 'baseui/tooltip';
// @ts-ignore
import { PopoverPlacementT } from 'baseui/popover/types';

type SimpleTooltipProps = {
  tooltip: React.ReactNode;
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
    <StatefulTooltip
      content={tooltip}
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
      overrides={{
        Inner: {
          style: ({ $theme }) => ({
            backgroundColor: $theme.colors.backgroundTertiary,
          }),
        },
        Arrow: {
          style: ({ $theme }) => ({
            backgroundColor: $theme.colors.backgroundTertiary,
          }),
        },
      }}
    >
      {title || children}
    </StatefulTooltip>
  );
};

export default SimpleTooltip;
