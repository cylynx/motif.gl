// https://g6.antv.vision/en/docs/api/graphLayout/guide

import { Layout } from '../redux/graph/types';

export const DAGRE_DEFAULT: Layout = {
  type: 'dagre',
  rankdir: 'TB',
  rankSep: 50,
  nodeSep: 12,
  // workerEnabled: true,
  // align: 'UL',
  // controlPoints: true,
};

export const CIRCLE_DEFAULT: Layout = {
  type: 'circular',
  startRadius: 250,
  endRadius: 250,
  angleRatio: 1,
  divisions: 5,
  workerEnabled: true,
  // center: [200, 200],
  // radius: null,
  // clockwise: false,
  // ordering: 'degree',
};

export const GRID_DEFAULT: Layout = {
  type: 'grid',
  begin: [0, 0],
  preventOverlapPadding: 20,
  rows: 4,
  sortBy: 'degree',
  condense: false,
  preventOverlap: true,
  workerEnabled: true,
  // nodeSize: 30,
};

export const RADIAL_DEFAULT: Layout = {
  type: 'radial',
  unitRadius: 100,
  linkDistance: 200,
  focusNode: '',
  preventOverlap: true,
  strictRadial: true,
  workerEnabled: true,
  // center: [200, 200],
  // maxIteration: 1000,
  // nodeSize: 30,
  // sortBy: 'data'
};

export const CONCENTRIC_DEFAULT: Layout = {
  type: 'concentric',
  minNodeSpacing: 50,
  sortBy: 'degree',
  preventOverlap: true,
  workerEnabled: true,
  // nodeSize: 30,
  // center: [200, 200],
  // sweep: 10,
  // equidistant: false,
  // startAngle: 0,
  // clockwise: false,
  // maxLevelDiff: 10,
};

export const GRAPHIN_FORCE_DEFAULT: Layout = {
  type: 'graphin-force',
  // coulombDisScale: 0.005,
  // gravity: 10,
  // workerEnabled: true,
  // gpuEnabled: true,
  // nodeStrength: 1000,
  // edgeStrength: 200,
  // center: [200, 200], // The center of the graph by default
  // linkDistance: 1,
  // nodeSize: 30,
};

export const FORCE_DEFAULT: Layout = {
  type: 'gForce',
  preventOverlap: true,
  gpuEnabled: true,
  linkDistance: 100,
  nodeSize: 30,
  nodeStrength: 700,
  edgeStrength: 400,
  coulombDisScale: 0.002,
  gravity: 1,
  alpha: 0.2,
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
  clustering: true,
  gravity: 10,
  clusterGravity: 10,
  speed: 2,
  workerEnabled: true,
  gpuEnabled: true,
  // center: [200, 200],
  // gravity: 20,
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
  FRUCHTERMAN_DEFAULT,
  { type: 'preset' },
  FORCE_DEFAULT,
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
  { label: 'Force-directed', id: 'graphin-force' },
  { label: 'Fruchterman-force', id: 'fruchterman' },
  { label: 'X Y Coordinates', id: 'preset' },
  // { label: 'Fruchterman', id: 'fruchterman' },
  // { label: 'Combo Force', id: 'comboForce' },
  // { label: 'MDS', id: 'mds' },
  // { label: 'Force-Directed', id: 'force' },
];
