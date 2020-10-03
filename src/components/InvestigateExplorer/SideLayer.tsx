import React from 'react';
import { Block } from 'baseui/block';

const SideLayer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Block
      position='fixed'
      top='0%'
      left='60px'
      width='360px'
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

export default SideLayer;
