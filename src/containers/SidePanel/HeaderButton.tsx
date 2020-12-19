/* eslint-disable react/destructuring-assignment */
import React, { Fragment } from 'react';
import { Button } from 'baseui/button';
import { PLACEMENT } from 'baseui/popover';
import { SimpleTooltip } from '../../components/ui';

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
      <SimpleTooltip tooltip={name} placement={PLACEMENT.bottom}>
        <Button
          $as='div'
          onClick={onClick}
          disabled={isDisabled}
          kind='tertiary'
          size='mini'
        >
          {icon}
        </Button>
      </SimpleTooltip>
    </Fragment>
  );
};

export default HeaderButton;
