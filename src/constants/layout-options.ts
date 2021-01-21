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

export const OPTIONS: Layout[] = [
  { type: 'dagre', options: DAGRE_DEFAULT },
  { type: 'circular', options: CIRCLE_DEFAULT },
  { type: 'grid', options: GRID_DEFAULT },
  { type: 'radial', options: RADIAL_DEFAULT },
  { type: 'concentric', options: CONCENTRIC_DEFAULT },
  { type: 'force' },
  { type: 'none' },
];

export const LAYOUT_NAMES = [
  { label: 'Concentric', id: 'concentric' },
  { label: 'Force-Directed', id: 'force' },
  { label: 'Radial', id: 'radial' },
  { label: 'Grid', id: 'grid' },
  { label: 'Sequential', id: 'dagre' },
  { label: 'Circular', id: 'circular' },
  { label: 'x y coordinates', id: 'none' },
];
