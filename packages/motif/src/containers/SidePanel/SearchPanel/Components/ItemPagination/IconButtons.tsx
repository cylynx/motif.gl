import React, { FC } from 'react';
import { Button, KIND, SIZE } from 'baseui/button';
import { Theme } from 'baseui/theme';
import * as Icon from '../../../../../components/Icons';

type IconButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => any;
  disabled?: boolean;
};
export const DeleteButton: FC<IconButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      kind={KIND.secondary}
      size={SIZE.compact}
      overrides={{
        BaseButton: {
          style: ({ $theme }: { $theme: Theme }) => ({
            paddingTop: $theme.sizing.scale0,
            paddingBottom: $theme.sizing.scale0,
            paddingRight: $theme.sizing.scale0,
            paddingLeft: $theme.sizing.scale0,
            borderTopRightRadius: $theme.sizing.scale200,
            borderBottomRightRadius: $theme.sizing.scale200,
            borderTopLeftRadius: $theme.sizing.scale200,
            borderBottomLeftRadius: $theme.sizing.scale200,
            marginRight: $theme.sizing.scale200,
            ':hover': {
              backgroundColor: $theme.colors.backgroundNegative,
            },
          }),
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
      size={SIZE.compact}
      disabled={disabled}
      overrides={{
        BaseButton: {
          style: ({ $theme }: { $theme: Theme }) => ({
            paddingTop: $theme.sizing.scale0,
            paddingBottom: $theme.sizing.scale0,
            paddingRight: $theme.sizing.scale0,
            paddingLeft: $theme.sizing.scale0,
            borderTopLeftRadius: $theme.sizing.scale200,
            borderBottomLeftRadius: $theme.sizing.scale200,
            marginRight: $theme.sizing.scale0,
          }),
        },
      }}
    >
      <Icon.ChevronLeft />
    </Button>
  );
};

export const NextPageButton: FC<IconButtonProps> = ({ onClick, disabled }) => (
  <Button
    onClick={onClick}
    kind={KIND.secondary}
    size={SIZE.compact}
    disabled={disabled}
    overrides={{
      BaseButton: {
        style: ({ $theme }: { $theme: Theme }) => ({
          paddingTop: $theme.sizing.scale0,
          paddingBottom: $theme.sizing.scale0,
          paddingRight: $theme.sizing.scale0,
          paddingLeft: $theme.sizing.scale0,
          borderTopRightRadius: $theme.sizing.scale200,
          borderBottomRightRadius: $theme.sizing.scale200,
        }),
      },
    }}
  >
    <Icon.ChevronRight />
  </Button>
);
