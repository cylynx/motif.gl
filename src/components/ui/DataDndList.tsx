import React, { useState, MouseEvent } from 'react';
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { List } from 'baseui/dnd-list';

type DndItem = {
  key: number;
  title: string;
};

type DataDndListProps = {
  items: DndItem[];
  onChangeOrder: (oldIndex: number, newIndex: number) => void;
  onDelete: (index: number) => void;
};

type DndContainerProps = {
  onDelete: (index: number) => void;
  item: DndItem;
};

type ActionButton = {
  onClick?: (...args: any[]) => void;
  [x: string]: any;
};

const VisibilityButton = ({
  onClick: onClickVisibility,
  ...rest
}: ActionButton) => {
  const [isVisible, setIsVisible] = useState(true);
  const toggleVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log('toggle visibility');
    setIsVisible((visible) => !visible);
    if (onClickVisibility) {
      onClickVisibility();
    }
  };

  return (
    <Button
      size='compact'
      shape='round'
      kind='minimal'
      $as='div' // Avoid button in button error
      onClick={toggleVisibility}
      {...rest}
    >
      {isVisible ? (
        <AiOutlineEye size={18} />
      ) : (
        <AiOutlineEyeInvisible size={18} />
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
      size='compact'
      shape='round'
      kind='minimal'
      $as='div'
      onClick={toggleDelete}
      {...rest}
    >
      <AiOutlineDelete size={18} />
    </Button>
  );
};

const DndContainer = ({ item, onDelete }: DndContainerProps) => {
  const ButtonGroup = () => (
    <Block>
      <VisibilityButton />
      <DeleteButton onClick={() => onDelete(item.key)} />
    </Block>
  );

  return (
    <Button
      onClick={() => console.log('clicked')}
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
      {item.title}
    </Button>
  );
};

const DataDndList = ({ items, onChangeOrder, onDelete }: DataDndListProps) => {
  return (
    <List
      items={items}
      onChange={({ oldIndex, newIndex }) => onChangeOrder(oldIndex, newIndex)}
      overrides={{
        Item: {
          style: ({ $theme }) => {
            return {
              paddingTop: $theme.sizing.scale500,
              paddingBottom: $theme.sizing.scale500,
            };
          },
        },
        Label: {
          component: ({ $value }: { $value: any }) => {
            console.log($value);
            return (
              <Block width='100%'>
                <DndContainer item={$value} onDelete={onDelete} />
              </Block>
            );
          },
        },
      }}
    />
  );
};

export default DataDndList;
