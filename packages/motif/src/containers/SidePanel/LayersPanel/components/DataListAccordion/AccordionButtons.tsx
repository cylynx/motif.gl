import React, { MouseEvent, ReactNode, useCallback } from 'react';
import { Button, ButtonProps } from 'baseui/button';
import debounce from 'lodash/debounce';
import { SimpleTooltip } from '../../../../../components/ui';
import * as Icon from '../../../../../components/Icons';

type VisibilityButtonProps = {
  onClick: () => any;
  isVisible: boolean;
  [key: string]: any;
};
export const VisibilityButton = ({
  onClick,
  isVisible,
  ...rest
}: VisibilityButtonProps) => {
  const toggleVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleDebounce();
  };

  // toggle the graph's visibility rapidly will cause graphin to crash
  // apply `debounce` to postpone the mouse event's execution
  // https://github.com/cylynx/motif.gl/issues/76
  const onToggleDebounce = useCallback(
    debounce(() => {
      onClick();
    }, 250),
    [onClick],
  );

  return (
    <SimpleTooltip
      tooltip={isVisible ? 'Hide Layer' : 'Show Layer'}
      boundariesElement='viewPort'
    >
      <Button
        size='mini'
        shape='round'
        kind='tertiary'
        $as='div' // Avoid button in button error
        onClick={toggleVisibility}
        {...rest}
      >
        {isVisible ? <Icon.Eye /> : <Icon.EyeOff />}
      </Button>
    </SimpleTooltip>
  );
};

type DeleteButtonProps = {
  onClick: () => any;
  shape: ButtonProps['shape'];
  tooltip: ReactNode;
  [key: string]: any;
};
export const DeleteButton = ({
  onClick: onClickDelete,
  shape,
  tooltip,
  ...rest
}: DeleteButtonProps) => {
  const toggleDelete = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (onClickDelete) {
      onClickDelete();
    }
  };

  return (
    <SimpleTooltip tooltip={tooltip} boundariesElement='viewPort'>
      <Button
        size='mini'
        shape={shape}
        kind='tertiary'
        $as='div'
        onClick={toggleDelete}
        overrides={{
          BaseButton: {
            style: ({ $theme }) => ({
              ':hover': {
                backgroundColor: $theme.colors.backgroundNegative,
              },
            }),
          },
        }}
        {...rest}
      >
        <Icon.Trash />
      </Button>
    </SimpleTooltip>
  );
};

type TableButtonProps = { onClick: () => any; [key: string]: any };
export const TableButton = ({ onClick, ...rest }: TableButtonProps) => {
  const onDatatableClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onClick();
  };

  return (
    <SimpleTooltip tooltip='Node / Edge Table' boundariesElement='viewPort'>
      <Button
        size='mini'
        shape='round'
        kind='tertiary'
        $as='div'
        onClick={onDatatableClick}
        {...rest}
      >
        <Icon.Table />
      </Button>
    </SimpleTooltip>
  );
};
