# motif.gl

An out of the box graph visualization toolkit to assist analysis and investigation of network data.

Features:

- No server required, just a web browser
- Layered graph objects
- Support for rich graph strctures, including time series analysis
- Extensible with a widget based component system
- Multiple layout algorithms (force-directed, concentric, grid etc.)
- Multiple style options (global and local)
- Multiple import formats (json and csv with more to come!)

## Setup

Made with create-react-library

[![NPM](https://img.shields.io/npm/v/motif.gl.svg)](https://www.npmjs.com/package/motif.gl) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

### Develop with hot-reloading

```bash
npm install
npm start
```

Or `npm run build` to build the motif.gl components

### Simple CRA preview

```bash
cd example
npm install
npm start
```

### Use in own React project

```tsx
import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { Motif, MotifLightTheme, MotifDarkTheme } from 'motif.gl';
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
            name='Blocklynx'
            currency='ETH'
            secondaryTheme={MotifDarkTheme}
            accessors={{
              nodeID: 'id',
              nodeType: 'data.type',
              edgeSource: 'from',
              edgeTarget: 'to',
            }}
          />
        </Provider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
```

## Graph format

### Json Import

To import as a json object, the object needs to have two properties: nodes and edges. Nodes take an array with an id field along with any other variables. Edges take an array with an id, source and target field and any other other variables. The source and target should correspond to the node Ids. Each accept a label property as well. A metadata with key is optional. A sample json import is shown below:

```json
{
  "nodes": [
    {
      "id": "1",
      "label": "cat"
    },
    {
      "id": "2",
      "label": "dog"
    }
  ],
  "edges": [
    {
      "id": "txn a-b",
      "source": "1",
      "target": "2",
      "label": "cat-dog"
    }
  ],
  "metadata": {
    "key": 123
  }
}
```

**Node Styles**  
Each node can take a style property as follows. All style property are optional.

```json
style : {
  "size": 20,
  "color": "rgba(0,124,124,1)",
  "fontFamily": "sans-serif",
  "fontSize": 12
}
```

**Edge Styles**  
Each edge can take a style property as follows. All style property are optional.

```json
style : {
  "color": "rgba(0,0,0,1)",
  "width": 1,
  "pattern": null,
  "fontColor": "rgba(0,0,0,1)",
  "fontFamily": "sans-serif",
  "fontSize": 12
}
```

### CSV Import

Edge list data or a separate node and edge csv file are also supported. For an edge list, an id, source and target column is required. All other attributes would be treated as edge properties. For a node and edge dataset, the source and target of the edge csv should correspond with the id in the node csv.

## Built with

- Antv G6 and Graphin for the graph library
- Base Web and Styletron for the UI
- Redux for state management
- Typescript

## License

MIT © [cylynx](https://github.com/cylynx)
