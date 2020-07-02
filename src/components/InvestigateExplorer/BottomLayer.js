import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DarkTheme, ThemeProvider, useStyletron } from 'baseui';
import { Layer } from 'baseui/layer';
import { Button } from 'baseui/button';

import { ChevronDown, ChevronUp } from 'baseui/icon';
import { setBottomOpen } from '../../redux/uiSlice';
import { getUI } from '../../redux/accessors';

const BottomLayer = ({ children }) => {
  const isOpen = useSelector(state => getUI(state).bottomOpen);
  const dispatch = useDispatch();

  return (
    <>
      <ThemeProvider theme={DarkTheme}>
        <ToggleButton
          isOpen={isOpen}
          onClick={() => dispatch(setBottomOpen(!isOpen))}
        />
        {isOpen ? (
          <Layer>
            <Wrapper>{children}</Wrapper>
          </Layer>
        ) : null}
      </ThemeProvider>
    </>
  );
};

const ToggleButton = props => {
  const [css] = useStyletron();
  const { onClick, isOpen } = props;
  return (
    <Button
      className={css({
        position: 'fixed',
        bottom: isOpen ? '145px' : '5px',
        right: '2%',
      })}
      size="mini"
      shape="square"
      kind="secondary"
      onClick={onClick}
    >
      {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
    </Button>
  );
};

const Wrapper = props => {
  const [css, theme] = useStyletron();
  const { offset, color, children, forwardedRef } = props;
  return (
    <div
      className={css({
        position: 'fixed',
        bottom: offset || '5px',
        right: offset || '2%',
        height: '135px',
        width: '500px',
        backgroundColor: color || theme.colors.backgroundSecondary,
      })}
      ref={forwardedRef}
    >
      {children}
    </div>
  );
};

export default BottomLayer;
