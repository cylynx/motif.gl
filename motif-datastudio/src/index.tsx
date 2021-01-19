import '../../example/src/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DataStudioMessage } from './ImportDataStudio';

const dscc = require('@google/dscc');

const drawViz = (message: any) => {
  const rootDiv = document.createElement('div');
  rootDiv.setAttribute('id', 'root');
  document.getElementsByTagName('body')[0].appendChild(rootDiv);
  ReactDOM.render(<App data={message} />, document.getElementById('root'));
};

// const DSCC_IS_LOCAL = true;  // for local development only
const DSCC_IS_LOCAL = false;

if (DSCC_IS_LOCAL) {
  const local = require('./localMessage.js');
  const message: DataStudioMessage = local.message;
  drawViz(message);
} else {
  // pipe data from datastudio into Motif
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
