import React from 'react';

import { StatefulTooltip, PLACEMENT, TRIGGER_TYPE } from 'baseui/tooltip';

type SimpleTooltipProps = {
  title: string;
  tooltip: string;
};

const SimpleTooltip = ({ title, tooltip }: SimpleTooltipProps) => {
  return (
    <StatefulTooltip
      content={tooltip}
      placement={PLACEMENT.topLeft}
      triggerType={TRIGGER_TYPE.hover}
      showArrow
      ignoreBoundary
    >
      {title}
    </StatefulTooltip>
  );
};

export default SimpleTooltip;
