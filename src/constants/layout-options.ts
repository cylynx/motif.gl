// https://g6.antv.vision/en/docs/api/graphLayout/guide

import { Layout } from '../redux/graph/types';

export const DAGRE_DEFAULT: Layout = {
  type: 'dagre',
  rankdir: 'LR',
  rankSep: 50,
  nodeSep: 12,
  // align:'DL',
  // controlPoints: true,
};

export const CIRCLE_DEFAULT: Layout = {
  type: 'circular',
  startRadius: 100,
  endRadius: 100,
  angleRatio: 1,
  // center: [200, 200],
  // radius: null,
  // clockwise: false,
  // divisions: 5,
  // ordering: 'degree',
};

export const GRID_DEFAULT: Layout = {
  type: 'grid',
  begin: [0, 0],
  preventOverlapPadding: 20,
  rows: 2,
  preventOverlap: true,
  workerEnabled: true,
  // nodeSize: 30,
  // condense: false,
  // cols: 3, // automatically calculated based on the number of rows
  // sortBy: 'degree',
};

export const RADIAL_DEFAULT: Layout = {
  type: 'radial',
  unitRadius: 100,
  linkDistance: 100,
  preventOverlap: true,
  strictRadial: true,
  workerEnabled: true,
  // center: [200, 200],
  // maxIteration: 1000,
  // focusNode: 'node11',
  // nodeSize: 30,
  // sortBy: 'data'
};

export const CONCENTRIC_DEFAULT: Layout = {
  type: 'concentric',
  minNodeSpacing: 10,
  preventOverlap: true,
  workerEnabled: true,
  // nodeSize: 30,
  // sortBy: 'degree',
  // center: [200, 200],
  // sweep: 10,
  // equidistant: false,
  // startAngle: 0,
  // clockwise: false,
  // maxLevelDiff: 10,
  // sortBy: 'degree',
};

export const GFORCE_DEFAULT: Layout = {
  type: 'gForce',
  coulombDisScale: 0.005,
  gravity: 10,
  workerEnabled: true,
  gpuEnabled: true,
  // nodeStrength: 1000,
  // edgeStrength: 200,
  // center: [200, 200], // The center of the graph by default
  // linkDistance: 1,
  // nodeSize: 30,
};

export const FORCE_DEFAULT: Layout = {
  type: 'force',
  preventOverlap: true,
  nodeStrength: 1000,
  edgeStrength: 200,
  // center: [200, 200],
  // linkDistance: 50,
  // collideStrength: 0.8,
  // nodeSize: 30,
  // alpha: 0.3,
  // alphaDecay: 0.028,
  // alphaMin: 0.01,
  // forceSimulation: null,
};

export const FRUCHTERMAN_DEFAULT: Layout = {
  type: 'fruchterman',
  workerEnabled: true,
  gpuEnabled: true,
  // center: [200, 200],
  // gravity: 20,
  // speed: 2,
  // clustering: true,
  // clusterGravity: 30,
  // maxIteration: 2000,
};

export const MDS_DEFAULT: Layout = {
  type: 'mds',
  workerEnabled: true,
  // linkDistance: 50
};

export const COMBOFORCE_DEFAULT: Layout = {
  type: 'comboForce',
  // center: [ 200, 200 ],     // The center of the graph by default
  //   linkDistance: 50,         // Edge length
  //   nodeStrength: 30,
  //   edgeStrength: 0.1,
};

export const OPTIONS: Layout[] = [
  CONCENTRIC_DEFAULT,
  GRID_DEFAULT,
  CIRCLE_DEFAULT,
  DAGRE_DEFAULT,
  RADIAL_DEFAULT,
  GFORCE_DEFAULT,
  { type: 'none' },
  // FORCE_DEFAULT,
  // FRUCHTERMAN_DEFAULT,
  // MDS_DEFAULT,
  // COMBOFORCE_DEFAULT,
];

export const LAYOUT_NAMES = [
  { label: 'Concentric', id: 'concentric' },
  { label: 'Radial', id: 'radial' },
  { label: 'Grid', id: 'grid' },
  { label: 'Sequential', id: 'dagre' },
  { label: 'Circular', id: 'circular' },
  { label: 'Force-directed', id: 'gForce' },
  { label: 'X Y Coordinates', id: 'none' },
  // { label: 'Fruchterman', id: 'fruchterman' },
  // { label: 'Combo Force', id: 'comboForce' },
  // { label: 'MDS', id: 'mds' },
  // { label: 'Force-Directed', id: 'force' },
];
