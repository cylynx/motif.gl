/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { Button, ButtonProps } from 'baseui/button';
import * as Icon from '../../../motif/src/components/Icons';

type BorderButtonProps = ButtonProps & {
  hasBorder?: boolean;
  disabled?: boolean;
};

export const TextBorderButton: FC<BorderButtonProps> = ({
  hasBorder,
  disabled,
}) => {
  return (
    <Button
      disabled={disabled}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: $theme.colors.backgroundSecondary,
              color: $theme.colors.backgroundInversePrimary,
              minWidth: '63px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#53535A',
                color: $theme.colors.backgroundInversePrimary,
              },
              borderWidth: '3px',
              borderStyle: 'solid',
              borderRadius: '6px',
              borderColor: hasBorder ? $theme.colors.accent500 : 'transparent',
            };
          },
        },
      }}
    >
      Border Button
    </Button>
  );
};

export const ImportBorderButton: FC<BorderButtonProps> = ({
  hasBorder,
  disabled,
}) => {
  return (
    <Button
      disabled={disabled}
      startEnhancer={<Icon.Plus />}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: $theme.colors.backgroundSecondary,
              color: $theme.colors.backgroundInversePrimary,
              minWidth: '99px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#53535A',
                color: $theme.colors.backgroundInversePrimary,
              },
              borderWidth: '3px',
              borderStyle: 'solid',
              borderRadius: '6px',
              borderColor: hasBorder ? $theme.colors.accent500 : 'transparent',
            };
          },
        },
      }}
    >
      Start enhancer
    </Button>
  );
};

export const IconBorderButton: FC<BorderButtonProps> = ({
  hasBorder,
  disabled,
}) => {
  return (
    <Button
      disabled={disabled}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: $theme.colors.backgroundSecondary,
              color: $theme.colors.backgroundInversePrimary,
              minWidth: '36px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#53535A',
                color: $theme.colors.backgroundInversePrimary,
              },
              borderWidth: '3px',
              borderStyle: 'solid',
              borderRadius: '6px',
              borderColor: hasBorder ? $theme.colors.accent500 : 'transparent',
            };
          },
        },
      }}
    >
      <Icon.Redo size={18} />
    </Button>
  );
};
