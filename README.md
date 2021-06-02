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

### Usage

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

## Contribution

Motif utilise [Lerna](https://github.com/lerna/lerna) to manage multi-package repositories to ease up collaboration and testing. The library is bundled with [Vite](https://github.com/vitejs/vite).

### Packages

- [@cylynx/motif](https://www.npmjs.com/package/@cylynx/motif), Core Library of Motif
- [@cylynx/pymotif](https://www.npmjs.com/package/@cylynx/pymotif), Jupyter widget bindings for Motif
- **motif-demo**, Client side that test the functionality of **@cylynx/motif**

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

### Preview Library on Client Side

**Perform Bundling into Typescript Library**

```bash
$ npm run motif:build
```

**Preview the Production Bundle**

```bash
$ npm run demo
```

### Testing

**Unit Test**

The test runner of **@cylynx/motif** is configure with [Jest](https://jestjs.io/) testing framework. The following commands are use to verify whether the test case are execute correctly.

```bash
$ cd ./packages/motif
$ npm run test
```

**Cypress Test**

Test runner of **@cylynx/motif** is configure with [Cypress](https://www.cypress.io/) testing framework. The motivation of having end-to-end test is to verify the consistency and accuracy of the library in client's browser environment. Therefore, several commands and procedure are requires as prequisite to setup the test environment.

1. Perform bundling on the `@cylynx/motif` packages to produce production bundles,

```bash
$ npm run motif:build
```

2. The production bundle produced in **step 1** will be import by **motif-demo**, the **motif-demo** play as a role to verify how the **@cylynx/motif** library behaves in client's browser environment. We will first generate a production build in **motif-demo**.

```bash
$ npm run demo:build
```

3. Serve the demo with port 3000, access `http://localhost:3000` to verify whether the application is running.

```bash
$ npm run demo:serve
```

4. Once the **step 3** is execute successfully, we can launch Cypress to verify whether our test case are running accurately.

```bash
$ cd ./packages/motif && npm run cypress:open
```

## Built with

- Antv G6 and Graphin for the graph library
- Base Web and Styletron for the UI
- Redux for state management
- Typescript

## License

MIT © [cylynx](https://github.com/cylynx)
