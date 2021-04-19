// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import Motif, {
  MotifLightTheme,
  MotifDarkTheme,
  SampleData,
  UploadFiles,
  ImportTabs,
} from '@cylynx/motif';
import { Driver } from 'neo4j-driver/types/driver';
import { Provider } from 'react-redux';
import BankingAPI from './containers/BankingAPI';
import store from './redux-store';
import Neo4J from './containers/Neo4J';

const engine = new Styletron();

const App = () => {
  const [driver, setDriver] = useState<Driver>({});
  const tabOverrides: ImportTabs[] = useMemo(() => {
    return [
      { title: 'File', key: 'file', component: <UploadFiles /> },
      {
        title: 'Sample Data',
        key: 'sample-data',
        component: <SampleData />,
      },
      {
        title: 'Neo4j',
        key: 'neo4j',
        component: <Neo4J driver={driver} setDriver={setDriver} />,
      },
      {
        title: 'Banking API',
        key: 'banking-api',
        component: <BankingAPI />,
      },
    ];
  }, [driver, setDriver]);

  // @ts-ignore
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
              Tabs: tabOverrides,
            }}
          />
        </Provider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
