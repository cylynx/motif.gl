import React, { Fragment } from 'react';
import { Button } from 'baseui/button';
import { PLACEMENT } from 'baseui/popover';
import { Block } from 'baseui/block';
import { SimpleTooltip } from '../../components/ui';

export type ToolbarItem = {
  key: number;
  name: string;
  icon: React.ReactNode;
  isDisabled: boolean;
  popoverContent: null | (() => any);
  onClick: null | (() => any);
};

export type ToolbarButtonProp = {
  key: number;
  item: ToolbarItem;
};

const ToolbarButton = ({ item }: ToolbarButtonProp) => {
  const { name, icon, isDisabled, popoverContent, onClick } = item;

  return (
    <Fragment>
      <SimpleTooltip
        tooltip={popoverContent || name}
        placement={PLACEMENT.left}
      >
        <Button
          $as='div'
          onClick={onClick}
          disabled={isDisabled}
          kind='secondary'
          size='compact'
          data-testid={`ToolbarButton:${name}`}
        >
          {icon}
        </Button>
      </SimpleTooltip>
      <Block paddingTop='5px' />
    </Fragment>
  );
};

export default ToolbarButton;
