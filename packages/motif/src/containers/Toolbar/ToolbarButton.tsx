import React, { Fragment } from 'react';
import { PLACEMENT } from 'baseui/popover';
import { Block } from 'baseui/block';
import { SimpleTooltip, Button } from '../../components/ui';

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
          shape='square'
          data-testid={`ToolbarButton:${name}`}
        >
          {icon}
        </Button>
      </SimpleTooltip>
      <Block paddingTop='4px' />
    </Fragment>
  );
};

export default ToolbarButton;
