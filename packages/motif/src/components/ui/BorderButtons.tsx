/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { Button, ButtonProps } from 'baseui/button';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';
import * as Icon from '../Icons';

type BorderButtonProps = ButtonProps & {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => any;
  hasBorder?: boolean;
  disabled?: boolean;
};

export const NewFolderButton: FC<BorderButtonProps> = ({
  onClick,
  hasBorder,
  disabled,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: '#488F80',
              color: $theme.colors.backgroundInversePrimary,
              minWidth: '99px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#65A194',
                color: $theme.colors.backgroundInversePrimary,
              },
              borderWidth: '3px',
              borderStyle: 'solid',
              borderRadius: '6px',
              borderColor: hasBorder ? '#488F80' : 'none',
            };
          },
        },
      }}
    >
      New folder
    </Button>
  );
};

export const OpenButton: FC<BorderButtonProps> = ({
  onClick,
  hasBorder,
  disabled,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: '#32323A',
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
              borderColor: hasBorder ? '#488F80' : 'none',
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
  disabled,
}) => {
  return (
    <Button
      startEnhancer={<Icon.Plus />}
      onClick={onClick}
      disabled={disabled}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: '#32323A',
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
              borderColor: hasBorder ? '#488F80' : 'none',
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
  disabled,
}) => {
  return (
    <Button
      endEnhancer={<Icon.Plus />}
      onClick={onClick}
      disabled={disabled}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: '#32323A',
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
              borderColor: hasBorder ? '#488F80' : 'none',
            };
          },
        },
      }}
    >
      Import
    </Button>
  );
};
