import React, { FC, useMemo } from 'react';
import { Button, SIZE } from 'baseui/button';
import { colors } from 'baseui/tokens';
import * as Icon from '../../../components/Icons';

type AddFilterButtonType = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
  disabled?: boolean;
};

const AddFilterButton: FC<AddFilterButtonType> = ({ onClick, disabled }) => {
  return useMemo(
    () => (
      <Button
        startEnhancer={<Icon.Plus />}
        onClick={onClick}
        size={SIZE.compact}
        disabled={disabled}
        overrides={{
          BaseButton: {
            style: ({ $theme }) => {
              return {
                backgroundColor: colors.green500,
                textTransform: 'capitalize',
                color: $theme.colors.backgroundInversePrimary,
                width: '120px',
                marginTop: $theme.sizing.scale300,
                ':hover:not([disabled])': {
                  backgroundColor: colors.green400,
                  color: $theme.colors.backgroundInversePrimary,
                },
              };
            },
          },
        }}
      >
        add filter
      </Button>
    ),
    [onClick],
  );
};

export default AddFilterButton;
