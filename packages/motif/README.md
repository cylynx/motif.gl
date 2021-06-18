# @cylynx/motif

This is the core library of Motif.

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
            name='Motif'
            primaryTheme={MotifLightTheme}
            secondaryTheme={MotifDarkTheme}
            accessors={{
              nodeID: 'id',
              edgeID: 'id',
              edgeSource: 'source',
              edgeTarget: 'target',
            }}
          />
        </Provider>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default App;
```

## Folder Structure

Main elements are highlighted below

```bash
├── cypress # e2e tests
├── demo # Test application for development using vite
├── dist
├── node_modules
├── src
│   ├── assets # svg file
|   ├── components # ui components (no states)
│   ├── constants 
|   ├── containers # application components with state
│   │   ├── Graph # graph initialisation, behaviour, hook, styles
│   │   ├── ImportWizardModal # Import data wizard component
│   │   ├── SidePanel # Layers, options, filter, search panels
│   │   ├── Toolbar
│   │   ├── VariableInspector
│   │   ├── [...other folders]
│   │   └── Explorer.tsx # Assembles all the components
|   ├── redux # application logic and state
│   │   ├── graph # graph state
│   │   ├── import # import state
│   │   ├── investigate # combine reducer and selectors
│   │   ├── ui # ui state (fetch, import, modal, toasts)
│   │   ├── widget # controls which widget is displayed
│   │   └── import # import state
|   ├── theme # baseui theme
|   └── utils # data and graph utils for styling and aggregating
└── index.ts # all exports
```

## Graph Format

Please refer to [graph types](./src/redux/graph/types.ts) for up-to-date information on the exact specifications.

### JSON

The basic graph structure is represented as a JSON object and is similar to a D3 like graph data structure. Here's are the typings from the `GraphData` object:

```
export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  metadata?: Metadata;
  key?: number | string;
}
```

It requires two keys `nodes` and `edges` with array of objects as values.

`nodes` requires an `id` field to uniquely identify the nodes. `edges` requires `id`, `source` and `target` field to join a **source node** to a **target node**. The `source` and `target` should correspond to the `nodes.id`. Sample format for a simple json import is shown below:

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

A `key` attribute, if provided is used for de-deuplication purposes when multiple graphData is imported. The `metadata` field is parsed and inserted by the program at the data import stage. This contains information on the field typings.

### CSV

The application provide flexibilities for the user to upload **single edge list** or **separate node and edge** dataset in CSV format. A first row header is required and is used to infer the columns of datasets. Each line that follows is taken as a data record.

**Edge List (One File)**

Edge List CSV requires `id`, `source` and `target` column to specify the relationship of nodes. The `source` and `target` field will be mapped to the underlying properties in the `edge` object in the graph. Other attributes will be treated as edge properties.

**Node and Edge (Two Files)**

The **Edge CSV** is mapped to the `edge` object in the graph and **Node CSV** is mapped to the `node` object. The `source` and `target` field in the **Edge CSV** should correspond with the `id` in the **Node CSV**.

### Neo4j

The demo also comes with a sample database connection with Neo4j via its default javascript library through websocket connection. Queries written in the Cypher query language will be sent to Neo4j for processing and returned to the application for visualization.

## Widgets

Widgets hook into the graph state and provide more information on it as well as other controls to modify the state.

### Layers Panel

Located in `./src/containers/SidePanel/LayersPanel`

Displays information on the overall graph imports exposes a node properties and edge properties panel which can be toggled to manage the tooltips of the graph.

### Styles Panel

Located in `./src/containers/SidePanel/OptionsPanel`

Allows configuration of layouts, node and edge styles

### Filter Panel

Located in `./src/containers/SidePanel/FilterPanel`

Allows adding of filters to limit the data that is displayed. Filters apply additively.

### Search Panel

Located in `./src/containers/SidePanel/SearchPanel`

Retrieve information on nodes / edges by searching on their id. Also displays results when users select nodes or edges on the graph.

### Variable Inspector

Located in `./src/containers/VariableInspector`

Adds a soft filter to the graph for a user to focus on particular areas of interest. It can be used on a time-series attribute with the playback action buttons to visualise activities over time.

### Toolbar

Located in `./src/containers/Toolbar`

Some helpful buttons to configure legend, expand to fullscreen, undo, redo, zoom-in, zoom-out, and clear canvas.

## State Management

State is managed by redux. See the respective `slice.ts` in the `redux` folder for more information on the actions and reducers.

It is recommended that an application controls the state of the graph through this action/reducer framework to ensure that the rest of the user interface is correctly rendered.

## License

MIT © [cylynx](https://github.com/cylynx)
