/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { Button, ButtonProps } from 'baseui/button';
import * as Icon from '../Icons';

type BorderButtonProps = ButtonProps & {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => any;
  hasBorder?: boolean;
};

export const NewFolderButton: FC<BorderButtonProps> = ({
  onClick,
  hasBorder,
}) => {
  return (
    <Button
      onClick={onClick}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: '#3C785C',
              color: $theme.colors.backgroundInversePrimary,
              minWidth: '99px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#65A194',
                color: $theme.colors.backgroundInversePrimary,
              },
              outline: hasBorder ? '#488F80 solid' : 'none',
            };
          },
        },
      }}
    >
      New folder
    </Button>
  );
};

export const OpenButton: FC<BorderButtonProps> = ({ onClick, hasBorder }) => {
  return (
    <Button
      onClick={onClick}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: '#2A2A31',
              color: $theme.colors.backgroundInversePrimary,
              minWidth: '63px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#53535A',
                color: $theme.colors.backgroundInversePrimary,
              },
              outline: hasBorder ? '#488F80 solid' : 'none',
            };
          },
        },
      }}
    >
      Open
    </Button>
  );
};

export const PlusImportButton: FC<BorderButtonProps> = ({
  onClick,
  hasBorder,
}) => {
  return (
    <Button
      startEnhancer={<Icon.Plus />}
      onClick={onClick}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: '#2A2A31',
              color: $theme.colors.backgroundInversePrimary,
              minWidth: '99px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#53535A',
                color: $theme.colors.backgroundInversePrimary,
              },
              outline: hasBorder ? '#488F80 solid' : 'none',
            };
          },
        },
      }}
    >
      Import
    </Button>
  );
};

export const ImportPlusButton: FC<BorderButtonProps> = ({
  onClick,
  hasBorder,
}) => {
  return (
    <Button
      endEnhancer={<Icon.Plus />}
      onClick={onClick}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: '#2A2A31',
              color: $theme.colors.backgroundInversePrimary,
              minWidth: '99px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#53535A',
                color: $theme.colors.backgroundInversePrimary,
              },
              outline: hasBorder ? '#488F80 solid' : 'none',
            };
          },
        },
      }}
    >
      Import
    </Button>
  );
};
