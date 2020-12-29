import React, { FC, useMemo } from 'react';
import { Button, SIZE } from 'baseui/button';
import { colors } from 'baseui/tokens';
import * as Icon from '../../../components/Icons';

type AddFilterButtonType = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
};

const AddFilterButton: FC<AddFilterButtonType> = ({ onClick }) => {
  return useMemo(
    () => (
      <Button
        startEnhancer={<Icon.Plus />}
        onClick={onClick}
        size={SIZE.compact}
        overrides={{
          BaseButton: {
            style: ({ $theme }) => {
              return {
                backgroundColor: colors.green600,
                textTransform: 'capitalize',
                color: $theme.colors.inputPlaceholder,
                width: '120px',
                marginTop: $theme.sizing.scale300,
                ':hover': {
                  backgroundColor: colors.green500,
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
