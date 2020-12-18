/* eslint-disable react/destructuring-assignment */
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
  onClick: null | (() => any);
};

export type ToolbarButtonProp = {
  key: number;
  item: ToolbarItem;
};

const ToolbarButton = (props: ToolbarButtonProp) => {
  const { name, icon, isDisabled, onClick } = props.item;

  return (
    <Fragment>
      <SimpleTooltip tooltip={name} placement={PLACEMENT.left}>
        <Button
          $as='div'
          onClick={onClick}
          disabled={isDisabled}
          kind='secondary'
          size='compact'
        >
          {icon}
        </Button>
      </SimpleTooltip>
      <Block paddingTop='5px' />
    </Fragment>
  );
};

export default ToolbarButton;
