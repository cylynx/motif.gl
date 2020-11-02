import React, { useState, MouseEvent } from 'react';
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineTrash,
  HiChevronDown,
} from 'react-icons/hi';

import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
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
        {isVisible ? <HiOutlineEye size={16} /> : <HiOutlineEyeOff size={16} />}
      </Button>
    </SimpleTooltip>
  );
};

export const DeleteButton = ({
  onClick: onClickDelete,
  ...rest
}: ActionButton) => {
  const toggleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClickDelete) {
      onClickDelete();
    }
  };

  return (
    <SimpleTooltip tooltip='Delete Layer'>
      <Button
        size='mini'
        shape='round'
        kind='minimal'
        $as='div'
        onClick={toggleDelete}
        {...rest}
      >
        <HiOutlineTrash size={16} />
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
        <HiChevronDown size={16} />
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
    <Block>
      <VisibilityButton
        isVisible={isVisible}
        onClick={() => onChangeVisibility(key, !isVisible)}
      />
      <DeleteButton onClick={() => onDelete(key)} />
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
              justifyContent: 'space-between',
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

  const onDeleteItem = (key: number) => {
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
          style: ({ $theme }: { $theme: any }) => {
            return {
              paddingTop: $theme.sizing.scale200,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
              borderBottomColor: $theme.colors.backgroundSecondary,
              borderLeftColor: $theme.colors.backgroundSecondary,
              borderRightColor: $theme.colors.backgroundSecondary,
              backgroundColor: $theme.colors.backgroundSecondary,
            };
          },
        },
        Label: {
          component: ({ $value }: { $value: any }) => {
            return (
              <Block width='100%' paddingBottom='scale200'>
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
