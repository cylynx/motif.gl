import React from 'react';

import { Button } from 'baseui/button';
import { StatefulPopover, PLACEMENT, TRIGGER_TYPE } from 'baseui/popover';
import { Label3 } from 'baseui/typography';
import { Block } from 'baseui/block';

const ToolbarItem = props => {
  const { name, icon, isDisabled, popoverContent, onClick } = props.item;

  return (
    <>
      <StatefulPopover
        content={popoverContent || <Label3 padding="scale300">{name}</Label3>}
        placement={PLACEMENT.left}
        showArrow
        triggerType={TRIGGER_TYPE.hover}
      >
        <Button
          $as="div"
          onClick={onClick}
          disabled={isDisabled}
          kind="secondary"
        >
          {icon}
        </Button>
      </StatefulPopover>
      <Block paddingTop="5px" />
    </>
  );
};

export default ToolbarItem;
