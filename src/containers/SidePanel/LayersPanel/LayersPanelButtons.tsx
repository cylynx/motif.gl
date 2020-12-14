import React, { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { resetState } from '../../../redux/graph-slice';
import { openImportModal } from '../../../redux';
import ToggleTokens from '../../../components/ToggleTokens';
import * as Icon from '../../../components/Icons';

export const ToggleAllButton = ({
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <Block width='150px'>
      <ToggleTokens
        options={[
          {
            label: selected ? 'Unselect All' : 'Select All',
            id: 'select',
            type: null,
            selected,
          },
        ]}
        onClick={onClick}
        shape='default'
      />
    </Block>
  );
};

export const ImportDataButton = () => {
  const dispatch = useDispatch();
  const onClickImport = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(openImportModal());
  };

  return (
    <Button
      kind='tertiary'
      size='compact'
      startEnhancer={() => <Icon.Plus size={18} />}
      onClick={onClickImport}
    >
      Import Data
    </Button>
  );
};

export const ClearDataButton = () => {
  const dispatch = useDispatch();
  const onClickClearAll = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(resetState());
  };

  return (
    <Button
      kind='tertiary'
      size='compact'
      startEnhancer={() => <Icon.Trash size={18} />}
      onClick={onClickClearAll}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => ({
            ':hover': {
              backgroundColor: $theme.colors.backgroundNegative,
            },
          }),
        },
      }}
    >
      Clear All
    </Button>
  );
};
