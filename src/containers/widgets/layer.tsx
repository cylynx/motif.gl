import React from 'react';
import { Block } from 'baseui/block';
import {
  SIDE_NAVBAR_WIDTH,
  LEFT_LAYER_WIDTH,
} from '../../constants/widget-units';

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
      top='0px'
      bottom='0px'
      left={SIDE_NAVBAR_WIDTH}
      width='310px'
      paddingTop='scale600'
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
