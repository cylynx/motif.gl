import React, { FC, MouseEvent, useMemo } from 'react';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { colors } from 'baseui/tokens';
import { Theme } from 'baseui/theme';
import * as Icon from '../../../../components/Icons';
import SelectVariable, {
  SelectOptions,
  SelectVariableOption,
  SelectVariableProps,
} from '../../../../components/SelectVariable/SelectVariable';

type FilterSelectionHeaderProps = {
  selectOptions: SelectOptions;
  selection: SelectVariableOption[];
  onSelectChange: SelectVariableProps['onChange'];
  onDeleteBtnClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

const Header: FC<FilterSelectionHeaderProps> = ({
  selectOptions,
  onSelectChange,
  selection,
  onDeleteBtnClick,
}) => {
  const ButtonGroupMemo = useMemo(
    (): JSX.Element => (
      <Block paddingLeft='scale100'>
        <Button
          data-testid='filter-selection-header:delete'
          size='mini'
          kind='minimal'
          $as='div'
          onClick={onDeleteBtnClick}
          overrides={{
            BaseButton: {
              style: ({ $theme }: { $theme: Theme }) => ({
                paddingTop: $theme.sizing.scale400,
                paddingRight: $theme.sizing.scale400,
                paddingBottom: $theme.sizing.scale400,
                paddingLeft: $theme.sizing.scale400,
                backgroundColor: $theme.colors.backgroundTertiary,
                ':hover': {
                  backgroundColor: colors.red500,
                },
              }),
            },
          }}
        >
          <Icon.Trash />
        </Button>
      </Block>
    ),
    [onDeleteBtnClick],
  );

  return (
    <Block
      backgroundColor='backgroundTertiary'
      padding='scale300'
      width='auto'
      display='flex'
    >
      <SelectVariable
        data-testid='filter-selection-header:select-variable'
        value={selection}
        options={selectOptions}
        onChange={onSelectChange}
        placeholder='Select a field'
        valueKey='optionKey'
      />
      {ButtonGroupMemo}
    </Block>
  );
};

export default Header;
