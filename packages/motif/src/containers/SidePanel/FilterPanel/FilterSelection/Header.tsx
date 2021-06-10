import React, { FC, MouseEvent, useMemo } from 'react';
import { Block } from 'baseui/block';
// import { Button } from 'baseui/button';
import { colors } from 'baseui/tokens';
import { LabelSmall } from 'baseui/typography';
import * as Icon from '../../../../components/Icons';
import { Button } from '../../../../components/ui';
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
          shape='square'
          kind='minimal'
          $as='div'
          onClick={onDeleteBtnClick}
          BaseButtonStyleOverrides={{
            ':hover': {
              backgroundColor: colors.red500,
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
    <Block paddingBottom='scale200'>
      <LabelSmall paddingBottom='scale100' color='contentInverseSecondary'>
        Select variable
      </LabelSmall>
      <Block display='flex' width='auto'>
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
    </Block>
  );
};

export default Header;
