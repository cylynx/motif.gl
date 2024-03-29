import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { defaultWidgetList } from '../widgets';
import { SIDE_NAVBAR_WIDTH } from '../../constants/widget-units';

const SideLayer = () => {
  return useMemo(
    () => (
      <Wrapper>
        <Logo width='26px' data-testid='side-navbar:logo' />
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
                <Block key={w.id} data-testid={w.id}>
                  {w.icon}
                </Block>
              ))}
          </Block>
          <Block marginBottom='32px'>
            {defaultWidgetList
              .filter((w) => w.position === 'bottom')
              .map((w) => (
                <Block key={w.id} data-testid={w.id}>
                  {w.icon}
                </Block>
              ))}
          </Block>
        </Block>
      </Wrapper>
    ),
    [],
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Block
    display='flex'
    flexDirection='column'
    alignItems='center'
    position='absolute'
    top='0%'
    left='0%'
    width={SIDE_NAVBAR_WIDTH}
    height='100%'
    backgroundColor='backgroundSecondary'
    data-testid='side-navbar'
  >
    {children}
  </Block>
);

export default SideLayer;
