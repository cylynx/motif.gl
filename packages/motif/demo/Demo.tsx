// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import { Block } from 'baseui/block';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { Provider } from 'react-redux';
import Motif, { MotifLightTheme, MotifDarkTheme } from '../src';
import store from './redux-store';

const engine = new Styletron();

const SampleHeader = () => {
  return (
    <Block
      data-testid='sample-header'
      paddingTop='4px'
      paddingBottom='4px'
      height='20px'
      $style={{
        textAlign: 'center',
        backgroundColor: 'black',
        color: 'white',
        fontSize: '16px',
      }}
    >
      Demo Application
    </Block>
  );
};

const Demo = () => {
  return (
    <StyletronProvider value={engine}>
      <Provider store={store}>
        <Block height='100vh'>
          <Motif
            name='Motif'
            primaryTheme={MotifLightTheme}
            secondaryTheme={MotifDarkTheme}
            accessors={{
              nodeID: 'id',
              edgeSource: 'source',
              edgeTarget: 'target',
            }}
            // onSaveCloud={(exportData) => {
            //   console.log(exportData);
            // }}
          />
        </Block>
      </Provider>
    </StyletronProvider>
  );
};

ReactDOM.render(<Demo />, document.getElementById('root'));
