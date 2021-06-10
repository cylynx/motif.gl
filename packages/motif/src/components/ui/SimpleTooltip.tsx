import React from 'react';
import { StatefulTooltip, PLACEMENT, TRIGGER_TYPE } from 'baseui/tooltip';
import { BasePopoverProps } from 'baseui/popover';
// @ts-ignore
import { PopoverPlacementT } from 'baseui/popover/types';

type SimpleTooltipProps = {
  tooltip: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  placement?: PopoverPlacementT;
  overrides?: BasePopoverProps['overrides'];
};

const defaultOverrides: BasePopoverProps['overrides'] = {
  Body: {
    style: {
      // to display tooltip in front of canvas in Jupyter Notebook
      // the zIndex value must be lesser than Select to prevent overlapped with Options field.
      zIndex: 1,
    },
  },
  Inner: {
    style: ({ $theme }) => ({
      backgroundColor: $theme.colors.tooltipBackground,
      color: $theme.colors.tooltipText,
      fontSize: '12px',
      lineHeight: '18px',
    }),
  },
  Arrow: {
    style: ({ $theme }) => ({
      backgroundColor: $theme.colors.backgroundTertiary,
    }),
  },
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
  overrides = defaultOverrides,
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
            boundariesElement: 'scrollParent',
          },
          hide: {
            enabled: false,
          },
        },
      }}
      overrides={overrides}
    >
      {title || children}
    </StatefulTooltip>
  );
};

export default SimpleTooltip;
