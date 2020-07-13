import React from 'react';
import { DarkTheme, ThemeProvider, useStyletron } from 'baseui';
import { Layer } from 'baseui/layer';
import { Button } from 'baseui/button';

import { ChevronLeft, ChevronRight } from 'baseui/icon';
import * as Prop from '../../types/Prop';

const SideLayer: React.FC<Prop.Layer> = ({ children }) => {
  const [isOpen, setOpen] = React.useState(true);
  return (
    <ThemeProvider theme={DarkTheme}>
      <ToggleButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
      {isOpen ? (
        <Layer>
          <Wrapper>{children}</Wrapper>
        </Layer>
      ) : null}
    </ThemeProvider>
  );
};

const ToggleButton: React.FC<Prop.ToggleButton> = (props) => {
  const [css] = useStyletron();
  const { onClick, isOpen } = props;
  return (
    <div
      className={css({
        position: 'fixed',
        top: '20px',
        left: isOpen ? '375px' : '10px',
      })}
    >
      <Button size="mini" shape="square" kind="secondary" onClick={onClick}>
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </Button>
    </div>
  );
};

const Wrapper: React.FC<Prop.Wrapper> = (props) => {
  const [css, theme] = useStyletron();
  const {
 offset, color, children, forwardedRef,
} = props;
  return (
    <div
      className={css({
        position: 'fixed',
        top: offset || '0%',
        left: offset || '0%',
        width: '365px',
        height: '100%',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '15px',
        paddingRight: '15px',
        backgroundColor: color || theme.colors.backgroundSecondary,
        textAlign: 'left',
      })}
      ref={forwardedRef}
    >
      {children}
    </div>
  );
};

export default SideLayer;
