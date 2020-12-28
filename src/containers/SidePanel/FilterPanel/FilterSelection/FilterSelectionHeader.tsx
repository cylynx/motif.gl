import React, { FC, useState } from 'react';
import { Block } from 'baseui/block';
import { ButtonGroup } from 'baseui/button-group';
import { Button } from 'baseui/button';
import { colors } from 'baseui/tokens';
import { Theme } from 'baseui/theme';
import * as Icon from '../../../../components/Icons';
import SelectVariable, {
  SelectOptions,
} from '../../../../components/SelectVariable/SelectVariable';

type FilterSelectionHeaderProps = {
  selectOptions: SelectOptions;
};

const FilterSelectionHeader: FC<FilterSelectionHeaderProps> = ({
  selectOptions,
}) => {
  const [selection, setSelection] = useState([]);

  return (
    <Block
      backgroundColor='backgroundTertiary'
      padding='scale300'
      width='auto'
      display='flex'
    >
      <SelectVariable
        value={selection}
        options={selectOptions}
        onChange={(obj) => setSelection([obj])}
        placeholder='Select a field'
      />
      <Block paddingLeft='scale100'>
        <ButtonGroup>
          <Button
            size='mini'
            kind='minimal'
            $as='div'
            overrides={{
              BaseButton: {
                style: ({ $theme }: { $theme: Theme }) => ({
                  paddingTop: $theme.sizing.scale400,
                  paddingRight: $theme.sizing.scale400,
                  paddingBottom: $theme.sizing.scale400,
                  paddingLeft: $theme.sizing.scale400,
                  ':hover': {
                    backgroundColor: colors.yellow600,
                  },
                }),
              },
            }}
          >
            <Icon.Trash />
          </Button>
          <Button
            size='mini'
            kind='minimal'
            $as='div'
            overrides={{
              BaseButton: {
                style: ({ $theme }: { $theme: Theme }) => ({
                  paddingTop: $theme.sizing.scale400,
                  paddingRight: $theme.sizing.scale400,
                  paddingBottom: $theme.sizing.scale400,
                  paddingLeft: $theme.sizing.scale400,
                  ':hover': {
                    backgroundColor: colors.yellow600,
                  },
                }),
              },
            }}
          >
            <Icon.Time />
          </Button>
        </ButtonGroup>
      </Block>
    </Block>
  );
};

export default FilterSelectionHeader;
