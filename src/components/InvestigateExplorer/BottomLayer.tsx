import React from 'react';
import { Block } from 'baseui/block';

const BottomLayer = ({ children }: { children: React.ReactNode }) => (
  <Block
    position='fixed'
    bottom='5px'
    right='2%'
    height='135px'
    width='500px'
    backgroundColor='backgroundPrimary'
  >
    {children}
  </Block>
);
export default BottomLayer;
