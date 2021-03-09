import React, { FC, MouseEvent } from 'react';
import { Button, SIZE } from 'baseui/button';
import { colors } from 'baseui/tokens';
import * as Icon from '../../../../components/Icons';

type AddAttributesButtonProps = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => any;
};
const AddAttributesButton: FC<AddAttributesButtonProps> = ({ onClick }) => {
  return (
    <Button
      startEnhancer={<Icon.Plus />}
      onClick={onClick}
      size={SIZE.mini}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              backgroundColor: colors.green500,
              textTransform: 'capitalize',
              color: $theme.colors.backgroundInversePrimary,
              width: '100%',
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
      Add Attributes
    </Button>
  );
};

export default AddAttributesButton;
