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
              getNodeID: (node) => node.id,
              getEdgeID: (edge) => edge.id,
              getEdgeSource: (edge) => edge.source,
              getEdgeTarget: (edge) => edge.target,
              getEdgeLabel: (edge) => edge.data.txn_hash,
              getEdgeTime: (edge) => edge.data.blk_ts_unix,
              getEdgeScore: (edge) => edge.data.score_vector,
              getEdgeWidth: (edge) => edge.data.value,
              getNodeLabel: (node) => node.data.address,
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
