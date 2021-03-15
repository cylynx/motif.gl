import React, { FC, MouseEvent, ReactNode } from 'react';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { SimpleTooltip } from '../../../../../components/ui';
import * as Icon from '../../../../../components/Icons';
import { ActionButton } from '../../../../../components/DndList';

const VisibilityButton = ({
  onClick: onClickVisibility,
  isVisible,
  ...rest
}: ActionButton) => {
  const toggleVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClickVisibility) {
      onClickVisibility();
    }
  };

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

const DeleteButton = ({
  onClick: onClickDelete,
  shape,
  tooltip,
  padding,
  ...rest
}: ActionButton) => {
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

const TableButton = ({ onClick, ...rest }: ActionButton) => {
  const onDatatableClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onClick();
  };

  return (
    <SimpleTooltip tooltip='Display Node/Edge Information'>
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
