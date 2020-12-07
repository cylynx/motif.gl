/* eslint-disable react/destructuring-assignment */
import React, { Fragment } from 'react';
import { Button } from 'baseui/button';
import { StatefulPopover, PLACEMENT, TRIGGER_TYPE } from 'baseui/popover';
import { LabelSmall } from 'baseui/typography';

export type HeaderButtonProp = {
  key: number;
  name: string;
  icon: React.ReactNode;
  isDisabled: boolean;
  onClick: () => any;
};

const HeaderButton = (props: HeaderButtonProp) => {
  const { name, icon, isDisabled, onClick } = props;

  return (
    <Fragment>
      <StatefulPopover
        content={<LabelSmall padding='scale200'>{name}</LabelSmall>}
        placement={PLACEMENT.bottom}
        showArrow
        triggerType={TRIGGER_TYPE.hover}
      >
        <Button
          $as='div'
          onClick={onClick}
          disabled={isDisabled}
          kind='tertiary'
          size='mini'
        >
          {icon}
        </Button>
      </StatefulPopover>
    </Fragment>
  );
};

export default HeaderButton;
