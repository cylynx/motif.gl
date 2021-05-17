import React, { FC } from 'react';
import { Button, ButtonProps } from 'baseui/button';

type BorderButtonProps = ButtonProps & {
  children: React.ReactNode;
};

const BorderButton: FC<BorderButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      {...rest}
      overrides={{
        BaseButton: {
          style: ({ $theme }) => {
            return {
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: $theme.colors.accent500,
            };
          },
        },
      }}
    >
      {children}
    </Button>
  );
};

export default BorderButton;
