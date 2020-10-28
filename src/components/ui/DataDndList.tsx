import React, { useState, MouseEvent } from 'react';
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineDown,
} from 'react-icons/ai';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import DndAccordian from './DndAccordian';

type DndItem = {
  key: number;
  title: string;
  isVisible: boolean;
  children: React.ReactNode;
};

type DataDndListProps = {
  items: DndItem[];
  onChangeOrder: (oldIndex: number, newIndex: number) => void;
  onDelete: (index: number) => void;
  onChangeVisibility: (index: number, isVisible: boolean) => void;
};

type DndContainerProps = {
  onDelete: (index: number) => void;
  onChangeVisibility: (index: number, isVisible: boolean) => void;
  toggleActive: (key: number) => void;
  item: DndItem;
};

type ActionButton = {
  onClick?: (...args: any[]) => void;
  [x: string]: any;
};

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
    <Button
      size='mini'
      shape='round'
      kind='minimal'
      $as='div' // Avoid button in button error
      onClick={toggleVisibility}
      {...rest}
    >
      {isVisible ? (
        <AiOutlineEye size={16} />
      ) : (
        <AiOutlineEyeInvisible size={16} />
      )}
    </Button>
  );
};

const DeleteButton = ({ onClick: onClickDelete, ...rest }: ActionButton) => {
  const toggleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClickDelete) {
      onClickDelete();
    }
  };

  return (
    <Button
      size='mini'
      shape='round'
      kind='minimal'
      $as='div'
      onClick={toggleDelete}
      {...rest}
    >
      <AiOutlineDelete size={16} />
    </Button>
  );
};

const ShowMoreButton = ({ onClick, ...rest }: ActionButton) => {
  return (
    <Button
      size='mini'
      shape='round'
      kind='minimal'
      $as='div'
      onClick={onClick}
      {...rest}
    >
      <AiOutlineDown size={16} />
    </Button>
  );
};

const DndContainer = ({
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
                backgroundColor: $theme.colors.backgroundPrimary,
              },
              ':active': {
                backgroundColor: $theme.colors.backgroundPrimary,
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

const DataDndList = ({
  items,
  onChangeOrder,
  onChangeVisibility,
  onDelete,
}: DataDndListProps) => {
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
              paddingBottom: $theme.sizing.scale200,
              paddingLeft: $theme.sizing.scale200,
              paddingRight: $theme.sizing.scale200,
            };
          },
        },
        Label: {
          component: ({ $value }: { $value: any }) => {
            return (
              <Block width='100%'>
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

export default DataDndList;
