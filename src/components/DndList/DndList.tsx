import React, { useState, MouseEvent } from 'react';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { Theme } from 'baseui/theme';
import * as Icon from '../Icons';
import { SimpleTooltip } from '../ui';

import DndAccordian from './DndAccordian';

export type DndItem = {
  key: number;
  title: string;
  isVisible: boolean;
  children: React.ReactNode;
};

export type DndListProps = {
  items: DndItem[];
  onChangeOrder: (oldIndex: number, newIndex: number) => void;
  onDelete: (index: number) => void;
  onChangeVisibility: (index: number, isVisible: boolean) => void;
};

export type DndContainerProps = {
  onDelete: (index: number) => void;
  onChangeVisibility: (index: number, isVisible: boolean) => void;
  toggleActive: (key: number) => void;
  item: DndItem;
};

export type ActionButton = {
  onClick?: (...args: any[]) => void;
  [x: string]: any;
};

export const VisibilityButton = ({
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

export const DeleteButton = ({
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

export const ShowMoreButton = ({ onClick, ...rest }: ActionButton) => {
  return (
    <SimpleTooltip tooltip='More Details'>
      <Button
        size='mini'
        shape='round'
        kind='minimal'
        $as='div'
        onClick={onClick}
        {...rest}
      >
        <Icon.ChevronDown />
      </Button>
    </SimpleTooltip>
  );
};

export const TableButton = ({ onClick, ...rest }: ActionButton) => {
  return (
    <SimpleTooltip tooltip='Display Node/Edge Information'>
      <Button
        size='mini'
        shape='round'
        kind='minimal'
        $as='div'
        onClick={onClick}
        {...rest}
      >
        <Icon.Table />
      </Button>
    </SimpleTooltip>
  );
};

export const DndContainer = ({
  item,
  onDelete,
  onChangeVisibility,
  toggleActive,
}: DndContainerProps) => {
  const { key, isVisible, title } = item;
  const ButtonGroup = () => (
    // applied a fixed width to allow button group align horizontally without affected by long title
    <Block width='112px'>
      <TableButton onClick={() => console.log('datatable')} />
      <VisibilityButton
        isVisible={isVisible}
        onClick={() => onChangeVisibility(key, !isVisible)}
      />
      <DeleteButton
        onClick={() => onDelete(key)}
        tooltip='Delete Layer'
        shape='round'
      />
      <ShowMoreButton onClick={() => toggleActive(key)} />
    </Block>
  );

  return (
    <Button
      kind='tertiary'
      size='compact'
      endEnhancer={<ButtonGroup />}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              width: '100%',
              paddingTop: '0',
              paddingBottom: '0',
              paddingRight: '0',
              paddingLeft: $theme.sizing.scale300,
              justifyContent: 'space-between',
              textAlign: 'left',
              ':hover': {
                backgroundColor: $theme.colors.backgroundSecondary,
              },
              ':active': {
                backgroundColor: $theme.colors.backgroundSecondary,
              },
            };
          },
        },
      }}
    >
      {title}
    </Button>
  );
};

const DndList = ({
  items,
  onChangeOrder,
  onChangeVisibility,
  onDelete,
}: DndListProps) => {
  const [expanded, setExpanded] = useState([]);

  const onChange = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    setExpanded(expanded.filter((x) => x !== oldIndex && x !== newIndex));
    onChangeOrder(oldIndex, newIndex);
  };

  const onExpand = (key: number) => {
    if (expanded.includes(key)) {
      setExpanded(expanded.filter((x) => x !== key));
    } else {
      setExpanded([...expanded, key]);
    }
  };

  const onDeleteItem = (key: number): void => {
    onDelete(key);
    setExpanded(expanded.filter((x) => x !== key));
  };

  return (
    <DndAccordian
      items={items}
      expanded={expanded}
      onChange={onChange}
      overrides={{
        Item: {
          style: ({ $theme }: { $theme: Theme }) => {
            return {
              backgroundColor: $theme.colors.backgroundSecondary,
              paddingTop: $theme.sizing.scale100,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
              marginBottom: $theme.sizing.scale300,
            };
          },
        },
        DragHandle: {
          style: ({ $theme }: { $theme: Theme }) => {
            return {
              marginRight: $theme.sizing.scale0,
              paddingBottom: $theme.sizing.scale100,
            };
          },
        },
        Label: {
          component: ({ $value }: { $value: any }) => {
            return (
              <Block width='100%' paddingBottom='scale100'>
                <DndContainer
                  item={$value}
                  onDelete={onDeleteItem}
                  onChangeVisibility={onChangeVisibility}
                  toggleActive={onExpand}
                />
              </Block>
            );
          },
        },
      }}
    />
  );
};

export default DndList;
