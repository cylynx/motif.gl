import React, { FC } from 'react';
import { Theme } from 'baseui/theme';
import { Button } from 'baseui/button';
import { colors } from 'baseui/tokens';
import * as Icon from '../../../../components/Icons';

const TimeSeriesButton: FC = () => {
  return (
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
  );
};

export default TimeSeriesButton;
