import React, { FC } from 'react';
import { Button as BaseButton, SHAPE, ButtonProps } from 'baseui/button';

type BorderButtonProps = ButtonProps & {
  children: React.ReactNode;
  width?: string;
  border?: 'solid' | 'none';
};

const Button: FC<BorderButtonProps> = ({
  children,
  width = 'auto',
  border = 'none',
  ...rest
}) => {
  return (
    <BaseButton
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
};

export default Button;
