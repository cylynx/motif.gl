[![NPM](https://img.shields.io/npm/v/@cylynx/motif.svg)](https://www.npmjs.com/package/@cylynx/motif) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# @cylynx/motif

> An out of the box graph visualization toolkit to assist analysis and investigation of network data.

- No server required, just a web browser
- Layered graph objects
- Support for rich graph strctures, including time series analysis
- Extensible with a widget based component system
- Multiple layout algorithms (force-directed, concentric, grid etc.)
- Multiple style options (global and local)
- Multiple import formats (json and csv with more to come!)

## Getting Started

```bash
$ npm install --save @cylynx/motif
```

### Prerequisites

| Peer Dependencies         | Version    |
| :------------------------ | :--------- |
| `baseui`                  | >= 9.112.0 |
| `react` and `react-dom`   | >= 16.8.0  |
| `styletron-engine-atomic` | >= 1.4.7   |
| `styletron-react`         | >= 5.2.7   |

| Development Environment | Version |
| :---------------------- | :------ |
| `node`                  | >=15    |
| `npm`                   | >=7     |

### Sample

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

## Contribution

Motif utilise [Lerna](https://github.com/lerna/lerna) to manage multi-package repositories to ease up collaboration and testing. The library is bundled with [Vite](https://github.com/vitejs/vite).

### Packages

|                           Packages                           | Description                                                             |
| :----------------------------------------------------------: | :---------------------------------------------------------------------- | ---------- |
| [@cylynx/motif](https://www.npmjs.com/package/@cylynx/motif) | Core Library of Motif                                                   | motif-demo |
|                          motif-demo                          | Client side that test the functionality and usability of Motif's bundle |

### Environment Installation

1. Verify Node and NPM version.

```bash
$ node -v
v15.14.0

$ npm -v
v7.7.6
```

2. Perform dependencies installation and link any cross-dependecies in the monorepo. This process create a symlink together all `packages` that are dependent to each others.

```bash
$ npm install --legacy-peer-deps
$ npm run bootstrap
```

### Develop with Hot-Reloading

The instruction below requires to be execute simultaneously during the development. We will perform watch on React component changes and strict-type checking to prevent nonsencial operation and estalish a smooth development experiences.

**Watch Component Changes**

```bash
$ npm run motif
```

**Develop with Strict Type-Checking**

```bash
$ npm run motif:tsc
```

### Perform Bundling into Typescript Library

```bash
$ npm run motif:build
```

### Preview Library on Client Side

**Perform Bundling into Typescript Library**

```bash
$ npm run motif:build
```

**Preview the Production Bundle**

```bash
$ npm run demo
```

## Built with

- Antv G6 and Graphin for the graph library
- Base Web and Styletron for the UI
- Redux for state management
- Typescript

## License

MIT © [cylynx](https://github.com/cylynx)
