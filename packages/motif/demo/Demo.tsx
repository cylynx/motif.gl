// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { Provider } from 'react-redux';
import { BaseProvider } from 'baseui';
import { Theme } from 'baseui/theme';
import Motif, { MotifLightTheme, MotifDarkTheme } from '../src';
import store from './redux-store';

const engine = new Styletron();

const Demo = () => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={MotifLightTheme as Theme}>
        <Provider store={store}>
          <Motif
            name='Motif'
            secondaryTheme={MotifDarkTheme}
            accessors={{
              nodeID: 'id',
              edgeSource: 'source',
              edgeTarget: 'target',
            }}
          />
        </Provider>
      </BaseProvider>
    </StyletronProvider>
  );
};

ReactDOM.render(<Demo />, document.getElementById('root'));
