import React, { FC, MouseEvent, ReactNode, useCallback } from 'react';
import { Button, ButtonProps } from 'baseui/button';
import { Block } from 'baseui/block';
import debounce from 'lodash/debounce';
import { SimpleTooltip } from '../../../../../components/ui';
import * as Icon from '../../../../../components/Icons';

type VisibilityButtonProps = {
  onClick: () => any;
  isVisible: boolean;
  [key: string]: any;
};
const VisibilityButton = ({
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
    <SimpleTooltip tooltip={isVisible ? 'Hide Layer' : 'Show Layer'}>
      <Button
        size='mini'
        shape='round'
        kind='minimal'
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
const DeleteButton = ({
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
    <SimpleTooltip tooltip={tooltip}>
      <Button
        size='mini'
        shape={shape}
        kind='minimal'
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
const TableButton = ({ onClick, ...rest }: TableButtonProps) => {
  const onDatatableClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onClick();
  };

  return (
    <SimpleTooltip tooltip='Node / Edge Table'>
      <Button
        size='mini'
        shape='round'
        kind='minimal'
        $as='div'
        onClick={onDatatableClick}
        {...rest}
      >
        <Icon.Table />
      </Button>
    </SimpleTooltip>
  );
};

type AccordionPanelProps = {
  index: number;
  onDatatableClick: (key: number) => void;
  isVisible: boolean;
  onChangeVisibility: (index: number, isVisible: boolean) => void;
  onDelete: (key: number) => void;
  title: ReactNode;
};
const AccordionPanel: FC<AccordionPanelProps> = ({
  index,
  onDatatableClick,
  isVisible,
  onChangeVisibility,
  onDelete,
  title,
}) => {
  return (
    <Block display='flex' justifyContent='space-between' width='100%'>
      <Block as='span' paddingTop='scale200'>
        {title}
      </Block>
      <Block>
        <TableButton onClick={() => onDatatableClick(index)} />
        <VisibilityButton
          isVisible={isVisible}
          onClick={() => onChangeVisibility(index, !isVisible)}
        />
        <DeleteButton
          onClick={() => onDelete(index)}
          tooltip='Delete Layer'
          shape='round'
        />
      </Block>
    </Block>
  );
};

export default AccordionPanel;
