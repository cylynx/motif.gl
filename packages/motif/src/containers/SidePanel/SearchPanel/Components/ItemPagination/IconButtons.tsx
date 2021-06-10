import React, { FC } from 'react';
import { useStyletron } from 'baseui';
import { KIND, SHAPE } from 'baseui/button';
import { Theme } from 'baseui/theme';
import { Button } from '../../../../../components/ui';
import * as Icon from '../../../../../components/Icons';

type IconButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => any;
  disabled?: boolean;
};
export const DeleteButton: FC<IconButtonProps> = ({ onClick }) => {
  const [, theme] = useStyletron();
  return (
    <Button
      onClick={onClick}
      kind={KIND.secondary}
      shape={SHAPE.square}
      BaseButtonStyleOverrides={{
        ':hover': {
          backgroundColor: theme.colors.backgroundNegative,
        },
      }}
    >
      <Icon.Trash />
    </Button>
  );
};

export const PreviousPageButton: FC<IconButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <Button
      onClick={onClick}
      kind={KIND.secondary}
      shape={SHAPE.square}
      disabled={disabled}
    >
      <Icon.ChevronLeft />
    </Button>
  );
};

export const NextPageButton: FC<IconButtonProps> = ({ onClick, disabled }) => (
  <Button
    onClick={onClick}
    kind={KIND.secondary}
    shape={SHAPE.square}
    disabled={disabled}
  >
    <Icon.ChevronRight />
  </Button>
);
