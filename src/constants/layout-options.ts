// https://graphin.antv.vision/en/docs/manual/main-concepts/layout

import { Layout } from '../redux/graph/types';

export const DAGRE_DEFAULT = {
  rankSep: 50,
  nodeSep: 12,
};

export const CIRCLE_DEFAULT = {
  r: 150,
  scale: 0.8,
};

export const GRID_DEFAULT = {
  nodeSep: 100,
  nodeSize: 50,
};

export const RADIAL_DEFAULT = {
  unitRadius: 100,
  nodeSize: 50,
};

export const CONCENTRIC_DEFAULT = {
  minNodeSpacing: 60,
};

// export const OPTIONS: Layout[] = [
//   { type: 'dagre', options: DAGRE_DEFAULT },
//   { type: 'circular', options: CIRCLE_DEFAULT },
//   { type: 'grid', options: GRID_DEFAULT },
//   { type: 'radial', options: RADIAL_DEFAULT },
//   { type: 'concentric', options: CONCENTRIC_DEFAULT },
//   { type: 'force' },
//   { type: 'none' },
// ];

export const OPTIONS: Layout[] = [
  {
    type: 'grid',
    // begin: [0, 0], // 可选，
    preventOverlap: true, // 可选，必须配合 nodeSize
    // preventOverlapPdding: 20, // 可选
    // nodeSize: 30, // 可选
    // condense: false, // 可选
    // rows: 5, // 可选
    // cols: 5, // 可选
    // sortBy: 'degree', // 可选
    workerEnabled: true, // 可选，开启 web-worker
  },
  {
    type: 'circular',
    // center: [200, 200], // 可选，默认为图的中心
    // radius: null, // 可选
    // startRadius: 10, // 可选
    // endRadius: 100, // 可选
    // clockwise: false, // 可选
    // divisions: 5, // 可选
    // ordering: 'degree', // 可选
    // angleRatio: 1, // 可选
  },
  {
    type: 'radial',
    // center: [200, 200], // 可选，默认为图的中心
    // linkDistance: 50, // 可选，边长
    // maxIteration: 1000, // 可选
    // focusNode: 'node11', // 可选
    // unitRadius: 100, // 可选
    preventOverlap: true, // 可选，必须配合 nodeSize
    // nodeSize: 30, // 可选
    strictRadial: true, // 可选
    workerEnabled: true, // 可选，开启 web-worker
  },
  {
    type: 'force',
    preventOverlap: true,
    // center: [200, 200], // 可选，默认为图的中心
    // linkDistance: 50, // 可选，边长
    // nodeStrength: 30, // 可选
    // edgeStrength: 0.8, // 可选
    // collideStrength: 0.8, // 可选
    // nodeSize: 30, // 可选
    // alpha: 0.9, // 可选
    // alphaDecay: 0.3, // 可选
    // alphaMin: 0.01, // 可选
    // forceSimulation: null, // 可选
    // onTick: () => {
    //   // 可选
    //   console.log('ticking');
    // },
    // onLayoutEnd: () => {
    //   // 可选
    //   console.log('force layout done');
    // },
  },
  {
    type: 'gForce',
    // linkDistance: 150, // 可选，边长
    // nodeStrength: 30, // 可选
    // edgeStrength: 0.1, // 可选
    // nodeSize: 30, // 可选
    // onTick: () => {
    //   // 可选
    //   console.log('ticking');
    // },
    // onLayoutEnd: () => {
    //   // 可选
    //   console.log('force layout done');
    // },
    workerEnabled: true, // 可选，开启 web-worker
    // gpuEnabled: false, // 可选，开启 GPU 并行计算，G6 4.0 支持
  },
  {
    type: 'concentric',
    // maxLevelDiff: 0.5,
    // sortBy: 'degree',
    // center: [200, 200], // 可选，
    // linkDistance: 50, // 可选，边长
    // preventOverlap: true, // 可选，必须配合 nodeSize
    // nodeSize: 30, // 可选
    // sweep: 10, // 可选
    // equidistant: false, // 可选
    // startAngle: 0, // 可选
    // clockwise: false, // 可选
    // maxLevelDiff: 10, // 可选
    // sortBy: 'degree', // 可选
    workerEnabled: true, // 可选，开启 web-worker
  },
  {
    type: 'dagre',
    // rankdir: 'LR', // 可选，默认为图的中心
    // align: 'DL', // 可选
    // nodesep: 20, // 可选
    // ranksep: 50, // 可选
    // controlPoints: true, // 可选
  },
  {
    type: 'fruchterman',
    // center: [200, 200], // 可选，默认为图的中心
    // gravity: 20, // 可选
    // speed: 2, // 可选
    // clustering: true, // 可选
    // clusterGravity: 30, // 可选
    // maxIteration: 2000, // 可选，迭代次数
    workerEnabled: true, // 可选，开启 web-worker
    // gpuEnabled: false, // 可选，开启 GPU 并行计算，G6 4.0 支持
  },
  {
    type: 'mds',
    workerEnabled: true, // 可选，开启 web-worker
  },
  {
    type: 'comboForce',
    // // center: [200, 200], // 可选，默认为图的中心
    // linkDistance: 50, // 可选，边长
    // nodeStrength: 30, // 可选
    // edgeStrength: 0.1, // 可选
    // onTick: () => {
    //   // 可选
    //   console.log('ticking');
    // },
    // onLayoutEnd: () => {
    //   // 可选
    //   console.log('combo force layout done');
    // },
  },
  { type: 'none' },
];

export const LAYOUT_NAMES = [
  { label: 'Concentric', id: 'concentric' },
  { label: 'Force-Directed', id: 'force' },
  { label: 'Radial', id: 'radial' },
  { label: 'Grid', id: 'grid' },
  { label: 'Sequential', id: 'dagre' },
  { label: 'Circular', id: 'circular' },
  { label: 'MDS', id: 'mds' },
  { label: 'Fruchterman', id: 'fruchterman' },
  { label: 'Combo Force', id: 'comboForce' },
  { label: 'G Force', id: 'gForce' },
  { label: 'X Y Coordinates', id: 'none' },
];
