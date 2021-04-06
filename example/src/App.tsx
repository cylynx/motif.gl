// @ts-nocheck
/* eslint-disable import/no-extraneous-dependencies */
import React, {useState} from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import Motif, {
  MotifLightTheme,
  MotifDarkTheme,
  ImportLocalFile,
  ImportSampleData,
} from 'motif.gl';
import { Provider } from 'react-redux';
import Query from './Query';
import QueryNeo4j from './QueryNeo4j';
import store from './redux-store';
import 'motif.gl/dist/index.css';

const engine = new Styletron();

const App = () => {

  const [driver, setDriver] = useState(false);

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
            overrides={{
              Tabs: [
                { title: 'File', key: 'file', component: <ImportLocalFile /> },
                {
                  title: 'Sample Data',
                  key: 'sample-data',
                  component: <ImportSampleData />,
                },
                {
                  title: 'Neo4j',
                  key: 'neo4j',
                  component: <QueryNeo4j driver={driver} setDriver={setDriver}/>,
                },
                {
                  title: 'Banking API',
                  key: 'banking-api',
                  component: <Query />,
                },
              ],
            }}
          />
        </Provider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
