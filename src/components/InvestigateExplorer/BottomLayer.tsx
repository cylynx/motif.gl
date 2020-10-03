import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { Layer } from 'baseui/layer';
import { Button } from 'baseui/button';

import { ChevronDown, ChevronUp } from 'baseui/icon';
import * as Prop from '../../types/Prop';
import { setBottomOpen } from '../../redux/ui-slice';
import { getUI } from '../../redux';

const BottomLayer = ({ children }: { children: React.ReactNode }) => {
  const isOpen = useSelector((state) => getUI(state).bottomOpen);
  const dispatch = useDispatch();
  return (
    <Fragment>
      <ToggleButton
        isOpen={isOpen}
        onClick={() => dispatch(setBottomOpen(!isOpen))}
      />
      {isOpen ? (
        <Layer>
          <Wrapper>{children}</Wrapper>
        </Layer>
      ) : null}
    </Fragment>
  );
};

const ToggleButton: React.FC<Prop.ToggleButton> = (props) => {
  const [css] = useStyletron();
  const { onClick, isOpen } = props;
  return (
    <div
      className={css({
        position: 'fixed',
        bottom: isOpen ? '145px' : '5px',
        right: '2%',
      })}
    >
      <Button size='mini' shape='square' kind='secondary' onClick={onClick}>
        {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </Button>
    </div>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
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
