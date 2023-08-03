import React from 'react';
import { StatefulTooltip, PLACEMENT, TRIGGER_TYPE } from 'baseui/tooltip';
import { BasePopoverProps } from 'baseui/popover';
import {
  PopoverPlacement,
  StatefulContentRenderProp,
} from 'baseui/popover/types';

type SimpleTooltipProps = {
  tooltip: React.ReactNode | StatefulContentRenderProp;
  title?: string;
  children?: React.ReactNode;
  placement?: PopoverPlacement;
  overrides?: BasePopoverProps['overrides'];
  // https://popper.js.org/docs/v1/#modifiers..preventOverflow.boundariesElement
  boundariesElement?: 'scrollParent' | 'window' | 'viewPort';
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
      paddingRight: $theme.sizing.scale300,
      paddingLeft: $theme.sizing.scale300,
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
 *
 * The boundariesElement is set to 'scrollParent' as default
 * - for the widget to display nicely in Jupyter Notebook.
 */
const SimpleTooltip = ({
  title,
  tooltip,
  placement = PLACEMENT.top,
  children,
  overrides = defaultOverrides,
  boundariesElement = 'scrollParent',
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
            boundariesElement,
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
