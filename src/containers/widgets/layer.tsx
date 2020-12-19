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
    right='10px'
    width='500px'
    backgroundColor='backgroundTertiary'
    paddingTop='scale600'
    paddingLeft='scale600'
    paddingRight='scale600'
  >
    {children}
  </Block>
);

export const LeftLayer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Block
      position='fixed'
      top='10px'
      bottom='10px'
      left='60px'
      width='310px'
      paddingTop='scale200'
      paddingBottom='scale200'
      paddingLeft='scale550'
      paddingRight='scale550'
      backgroundColor='backgroundPrimary'
      overflow='auto'
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
      top='10px'
      right='10px'
    >
      {children}
    </Block>
  );
};
