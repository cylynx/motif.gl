import React from 'react';
import { Block } from 'baseui/block';

export const BottomRightLayer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Block
    position='fixed'
    bottom='10px'
    right='20px'
    height='135px'
    width='500px'
    backgroundColor='backgroundPrimary'
  >
    {children}
  </Block>
);

export const LeftLayer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Block
      position='fixed'
      top='0%'
      left='60px'
      width='320px'
      height='100%'
      paddingTop='20px'
      paddingBottom='20px'
      paddingLeft='30px'
      paddingRight='30px'
      backgroundColor='backgroundPrimary'
    >
      {children}
    </Block>
  );
};

export const TopRightLayer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Block
      display='flex'
      flexDirection='column'
      position='fixed'
      top='20px'
      right='20px'
    >
      {children}
    </Block>
  );
};
