// @ts-nocheck
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import Motif, { MotifDarkTheme, MotifLightTheme } from '@cylynx/motif';
import { Provider } from 'react-redux';
import { EnhancedStore } from '@reduxjs/toolkit';
import '@cylynx/motif/dist/style.css';
import '../widget.css';

const engine = new Styletron({ prefix: 'm_' });

function renderRoot(
  div: HTMLDivElement,
  store: EnhancedStore,
  onRefChange: (ref: any) => void,
) {
  const Root = () => {
    const graphRef = useRef<any>(null);

    useEffect(() => {
      if (graphRef && graphRef.current && graphRef.current.graph) {
        onRefChange(graphRef.current);
      }
    }, [graphRef.current]);

    return (
      <StyletronProvider value={engine}>
        <BaseProvider theme={MotifLightTheme}>
          <Provider store={store}>
            <Motif
              ref={graphRef}
              name='Motif'
              primaryTheme={MotifLightTheme}
              secondaryTheme={MotifDarkTheme}
            />
          </Provider>
        </BaseProvider>
      </StyletronProvider>
    );
  };

  ReactDOM.render(<Root />, div);
}

export default renderRoot;
