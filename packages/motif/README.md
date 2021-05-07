# @cylynx/motif

This package is the core library of Motif.

## Installation

```bash
npm install --save @cylynx/motif
```

## Usage

```tsx
import React from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import Motif, { MotifLightTheme, MotifDarkTheme } from '@cylynx/motif';
import { Provider } from 'react-redux';
import store from './redux-store';
import '@cylynx/motif/dist/motif.css';

const engine = new Styletron();

const App = () => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={MotifLightTheme}>
        <Provider store={store}>
          <Motif
            name='Blocklynx'
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

## Graph Format

### JSON

The JSON object requires two keys `nodes` and `edges` with array of objects as values. The object of `nodes` requires `id` to uniquely identify the basic unit of data strcture. In addition, `edges` requires `id`, `source` and `target` field to join **source node** and **target node** to form a connection. The `source` and `target` should correspond to the `nodes.id`. The sample format for simple json import is shown below:

```json
{
  "nodes": [
    {
      "id": "cat"
    },
    {
      "id": "dog"
    }
  ],
  "edges": [
    {
      "id": "txn cat-dog",
      "source": "cat",
      "target": "dog"
    }
  ]
}
```

### CSV

The application provide flexibilities for user to upload **single edge list** or **separate node and edge** dataset in CSV format. First row of the file is use to specify the columns of datasets and follow by each line of the file as data record with specific delimiters.

**Edge List (One File)**

Edge List CSV requires `id`, `source` and `target` column to specify the relationship of nodes. The `source` and `target` field will convert into `node` that connected by `edge`. the other attributes or metadata in the record will be treated as edge properties.

**Node and Edge (Two Files)**

The **Edge CSV** is responsible to define the relationship of connected nodes and **Node CSV** possess the unique identier of `nodes` and it's metadata or attributes. The `source` and `target` field in the **Edge CSV** should correspond with the `id` in the **Node CSV**.

## License

MIT © [cylynx](https://github.com/cylynx)
