// https://graphin.antv.vision/en/docs/manual/main-concepts/layout

import * as Graph from '../containers/Graph/types';

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

export const OPTIONS: Graph.Layout[] = [
  { name: 'dagre', options: DAGRE_DEFAULT },
  { name: 'circle', options: CIRCLE_DEFAULT },
  { name: 'grid', options: GRID_DEFAULT },
  { name: 'radial', options: RADIAL_DEFAULT },
  { name: 'concentric', options: CONCENTRIC_DEFAULT },
  { name: 'force' },
];

export const LAYOUT_NAMES = [
  { label: 'Concentric', id: 'concentric' },
  { label: 'Force-Directed', id: 'force' },
  { label: 'Radial', id: 'radial' },
  { label: 'Grid', id: 'grid' },
  { label: 'Sequential', id: 'dagre' },
  { label: 'Circular', id: 'circle' },
];
