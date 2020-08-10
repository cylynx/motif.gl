/* eslint-disable react/destructuring-assignment */
import React, { Fragment } from 'react';
import { Button } from 'baseui/button';
import { StatefulPopover, PLACEMENT, TRIGGER_TYPE } from 'baseui/popover';
import { Label3 } from 'baseui/typography';
import { Block } from 'baseui/block';
import * as Prop from '../../types/Prop';

const ToolbarItem: React.FC<Prop.ToolbarItem> = (props) => {
  const { name, icon, isDisabled, popoverContent, onClick } = props.item;

  return (
    <Fragment>
      <StatefulPopover
        content={popoverContent || <Label3 padding='scale300'>{name}</Label3>}
        placement={PLACEMENT.left}
        showArrow
        triggerType={TRIGGER_TYPE.hover}
      >
        <Button
          $as='div'
          onClick={onClick}
          disabled={isDisabled}
          kind='secondary'
        >
          {icon}
        </Button>
      </StatefulPopover>
      <Block paddingTop='5px' />
    </Fragment>
  );
};

export default ToolbarItem;
