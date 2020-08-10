import React from 'react';
import { useStyletron, styled } from 'baseui';

import { Block } from 'baseui/block';

const DivPrimary = ({
  align,
  width,
  height,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  children,
}) => {
  const [, theme] = useStyletron();
  return (
    <Block
      paddingTop={paddingTop || '30px'}
      paddingBottom={paddingBottom || '30px'}
      paddingLeft={paddingLeft || ['20px', '20px', '10%', '10%']}
      paddingRight={paddingRight || ['20px', '20px', '10%', '10%']}
      width={width || '100%'}
      height={height || 'auto'}
      margin='0 auto'
      backgroundColor={theme.colors.backgroundPrimary}
      overrides={{
        Block: {
          style: { textAlign: align || 'left' },
        },
      }}
    >
      {children}
    </Block>
  );
};

const DivSecondary = ({
  align,
  width,
  height,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  backgroundColor,
  children,
}) => {
  const [, theme] = useStyletron();
  return (
    <Block
      paddingTop={paddingTop || '30px'}
      paddingBottom={paddingBottom || '30px'}
      paddingLeft={paddingLeft || ['20px', '20px', '10%', '10%']}
      paddingRight={paddingRight || ['20px', '20px', '10%', '10%']}
      width={width || '100%'}
      height={height || 'auto'}
      margin='0 auto'
      backgroundColor={backgroundColor || theme.colors.backgroundSecondary}
      overrides={{
        Block: {
          style: { textAlign: align || 'left' },
        },
      }}
    >
      {children}
    </Block>
  );
};

const Centered = styled('div', {
  margin: '0 auto',
  paddingLeft: '10%',
  paddingRight: '10%',
});

export { DivPrimary, DivSecondary, Centered };
