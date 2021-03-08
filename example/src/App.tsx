// @ts-nocheck
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import Motif, { MotifDarkTheme, MotifLightTheme } from 'motif.gl';
import { Provider } from 'react-redux';
import store from './redux-store';
import 'motif.gl/dist/index.css';

const engine = new Styletron();

const App = () => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={MotifLightTheme}>
        <Provider store={store}>
          <Motif
            name='Motif'
            secondaryTheme={MotifDarkTheme}
            accessors={{
              // getters below are for simple edge
              nodeID: 'id',
              // edgeID: 'id',
              edgeSource: 'source',
              edgeTarget: 'target',
            }}
            // overrides={
            //   {
            // Tabs: [{ title: 'Test', key: 'test', component: <div>hi</div> }],
            // Tooltip,
            //   }
            // }
          />
        </Provider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
