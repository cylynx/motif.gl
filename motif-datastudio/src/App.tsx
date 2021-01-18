// @ts-nocheck
import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { Motif, MotifLightTheme, MotifDarkTheme } from 'motif.gl';
import { Provider } from 'react-redux';
import store from './redux-store';
import 'motif.gl/dist/index.css';
import ImportDataStudio, { DataStudioMessage } from './ImportDataStudio';

const engine = new Styletron();

const App = ({ data }: { data: DataStudioMessage }) => {
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
              nodeType: 'data.type',
              // edgeID: 'id',
              edgeSource: 'from',
              edgeTarget: 'to',
            }}
            overrides={{
              Tabs: [
                {
                  key: 'datastudio',
                  title: 'Google Data Studio',
                  component: <ImportDataStudio data={data} />,
                },
                { key: 'file' },
                { key: 'sample-data' },
              ],
              // Tooltip,
            }}
          />
        </Provider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
