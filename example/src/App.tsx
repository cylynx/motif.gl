// @ts-nocheck
import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { Investigate } from 'motif.gl';
import { Provider } from 'react-redux';
import store from './redux-store';

const engine = new Styletron();

const App = () => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Provider store={store}>
          <Investigate
            name='Blocklynx'
            currency='ETH'
            accessorFns={{
              // getters below are for firebase
              getNodeID: 'id',
              getEdgeID: 'id',
              getEdgeSource: 'source',
              getEdgeTarget: 'target',
              getEdgeLabel: 'data.txn_hash',
              getEdgeTime: 'data.blk_ts_unix',
              getEdgeScore: 'data.score_vector',
              getEdgeWidth: 'data.value',
              getNodeLabel: 'label',
              // getters below are for nodobo
              // getEdgeWidth: edge => edge.data.other_id,
              // getEdgeTime: edge => edge.data.unix_ts,
              // getEdgeLabel: edge => edge.id,
              // getNodeLabel: node => node.data.name,
              // no getters required for Graphin mock data
            }}
            overrides={
              {
                // Tabs: {
                //   Hash: <QueryHash />,
                //   Neighbours: <QueryNeighbours />,
                //   Path: <QueryPath />,
                // },
                // NodeMenu,
                // score,
              }
            }
          />
        </Provider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
