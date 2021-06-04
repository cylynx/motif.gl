import React, { FC } from 'react';
import {
  Button as BaseButton,
  SHAPE,
  ButtonProps as BaseButtonProps,
} from 'baseui/button';

type ButtonProps = BaseButtonProps & {
  children: React.ReactNode;
  width?: string;
  border?: 'solid' | 'none';
};

type Ref = HTMLButtonElement;

const Button = React.forwardRef<Ref, ButtonProps>(
  ({ children, width = 'auto', border = 'none', ...rest }, ref) => {
    return (
      <BaseButton
        ref={ref}
        {...rest}
        size='compact'
        overrides={{
          BaseButton: {
            style: ({ $theme, $shape }) => {
              return {
                borderColor: $theme.colors.accent500,
                borderTopStyle: border,
                borderBottomStyle: border,
                borderLeftStyle: border,
                borderRightStyle: border,
                borderTopWidth: '1px',
                borderBottomWidth: '1px',
                borderLeftWidth: '1px',
                borderRightWidth: '1px',
                height: '32px',
                width:
                  $shape === SHAPE.circle || $shape === SHAPE.square
                    ? '32px'
                    : width,
              };
            },
          },
        }}
      >
        {children}
      </BaseButton>
    );
  },
);

export default Button;
