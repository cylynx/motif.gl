/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Button, ButtonProps } from 'baseui/button';

type FullButtonProps = ButtonProps & {
  children: React.ReactNode;
  width?: string | number | string;
};

type Ref = HTMLButtonElement;

// Button which streches the full width of the container
const FullButton = React.forwardRef<Ref, FullButtonProps>(
  ({ children, width = '100%', ...rest }, ref) => (
    <Button
      ref={ref}
      overrides={{
        BaseButton: {
          style: {
            width,
          },
        },
      }}
      {...rest}
    >
      {children}
    </Button>
  ),
);

export default FullButton;
