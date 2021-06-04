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
              borderColor: $theme.colors.accent500,
              borderTopStyle: 'solid',
              borderBottomStyle: 'solid',
              borderLeftStyle: 'solid',
              borderRightStyle: 'solid',
              borderTopWidth: '1px',
              borderBottomWidth: '1px',
              borderLeftWidth: '1px',
              borderRightWidth: '1px',
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
