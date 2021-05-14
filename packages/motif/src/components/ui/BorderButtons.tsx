/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Button, ButtonProps } from 'baseui/button';
import { UISlices } from '../../redux/ui';
import * as Icon from '../Icons';

type BorderButtonProps = ButtonProps & {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
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
              borderRadius: '6px',
              borderColor: hasBorder ? '#488F80' : 'transparent',
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
              borderColor: hasBorder ? '#488F80' : 'transparent',
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
  hasBorder,
  disabled,
}) => {
  const dispatch = useDispatch();
  const onClickImport = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(UISlices.openImportModal());
  };

  return (
    <Button
      startEnhancer={<Icon.Plus />}
      onClick={onClickImport}
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
              borderColor: hasBorder ? '#488F80' : 'transparent',
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
  hasBorder,
  disabled,
}) => {
  const dispatch = useDispatch();
  const onClickImport = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(UISlices.openImportModal());
  };

  return (
    <Button
      endEnhancer={<Icon.Plus />}
      onClick={onClickImport}
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
              borderColor: hasBorder ? '#488F80' : 'transparent',
            };
          },
        },
      }}
    >
      Import
    </Button>
  );
};

/* Icon buttons with border option */
export const ProfileGreenButton: FC<BorderButtonProps> = ({
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
              minWidth: '36px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#65A194',
                color: $theme.colors.backgroundInversePrimary,
              },
              borderWidth: '3px',
              borderStyle: 'solid',
              borderRadius: '6px',
              borderColor: hasBorder ? '#488F80' : 'transparent',
            };
          },
        },
      }}
    >
      <Icon.User size={20} />
    </Button>
  );
};

export const ProfileGreyButton: FC<BorderButtonProps> = ({
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
              minWidth: '36px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#53535A',
                color: $theme.colors.backgroundInversePrimary,
              },
              borderWidth: '3px',
              borderStyle: 'solid',
              borderRadius: '6px',
              borderColor: hasBorder ? '#488F80' : 'transparent',
            };
          },
        },
      }}
    >
      <Icon.User size={20} />
    </Button>
  );
};

export const UndoButton: FC<BorderButtonProps> = ({
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
              minWidth: '36px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#53535A',
                color: $theme.colors.backgroundInversePrimary,
              },
              borderWidth: '3px',
              borderStyle: 'solid',
              borderRadius: '6px',
              borderColor: hasBorder ? '#488F80' : 'transparent',
            };
          },
        },
      }}
    >
      <Icon.Undo size={20} />
    </Button>
  );
};

export const RedoButton: FC<BorderButtonProps> = ({
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
              minWidth: '36px',
              height: '36px',
              ':hover:not([disabled])': {
                backgroundColor: '#53535A',
                color: $theme.colors.backgroundInversePrimary,
              },
              borderWidth: '3px',
              borderStyle: 'solid',
              borderRadius: '6px',
              borderColor: hasBorder ? '#488F80' : 'transparent',
            };
          },
        },
      }}
    >
      <Icon.Redo size={20} />
    </Button>
  );
};
