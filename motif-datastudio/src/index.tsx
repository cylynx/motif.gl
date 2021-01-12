/*
const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');

const DSCC_IS_LOCAL = true;
// const DSCC_IS_LOCAL = false;

// write viz code here
const drawViz = (data : any) => {
  viz.readmeViz();
};

// renders locally
if (DSCC_IS_LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
*/
import '../../example/src/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from 'motif.gl/example/src/App';

ReactDOM.render(<App />, document.getElementsByTagName('body')[0]);
