import React, { useMemo, useState, useEffect } from 'react';
import initHelpHero from 'helphero';
import { Block } from 'baseui/block';
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
import '@cylynx/motif/dist/style.css';
import { Driver } from 'neo4j-driver/types/driver';
import { Provider } from 'react-redux';
import BankingAPI from './containers/BankingAPI';
import store from './redux-store';
import Neo4J from './containers/Neo4J';

const engine = new Styletron();

const App = () => {
  const [driver, setDriver] = useState<Driver>({});

  /* Product tour demo using help hero */
  useEffect(() => {
    if (import.meta.env.VITE_HELP_HERO_APP_ID) {
      // @ts-ignore
      const hlp = initHelpHero(import.meta.env.VITE_HELP_HERO_APP_ID);
      hlp.anonymous();
    }
  }, []);

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

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={MotifLightTheme}>
        <Provider store={store}>
          <Block height='100vh'>
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
          </Block>
        </Provider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
