import React from 'react';
import { Block } from 'baseui/block';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { defaultWidgetList } from '../widgets';

const SideLayer = () => {
  return (
    <Wrapper>
      <Logo width='26px' />
      <Block
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        height='100%'
      >
        <Block>
          {defaultWidgetList
            .filter((w) => w.position === 'top')
            .map((w) => (
              <Block key={w.id}>{w.icon}</Block>
            ))}
        </Block>
        <Block marginBottom='32px'>
          {defaultWidgetList
            .filter((w) => w.position === 'bottom')
            .map((w) => (
              <Block key={w.id}>{w.icon}</Block>
            ))}
        </Block>
      </Block>
    </Wrapper>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Block
    display='flex'
    flexDirection='column'
    alignItems='center'
    position='fixed'
    top='0%'
    left='0%'
    width='50px'
    height='100%'
    paddingBottom='20px'
    backgroundColor='backgroundSecondary'
  >
    {children}
  </Block>
);

export default SideLayer;
