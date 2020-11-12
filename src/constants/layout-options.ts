import * as Graph from '../types/Graph';

export const DAGRE_DEFAULT = {
  rankSep: 10,
};

export const CIRCLE_DEFAULT = {
  r: 150,
};

export const GRID_DEFAULT = {
  nodeSep: 45,
};

export const RADIAL_DEFAULT = {
  unitRadius: 200,
};

export const OPTIONS: Graph.Layout[] = [
  { name: 'dagre', options: DAGRE_DEFAULT },
  { name: 'circle', options: CIRCLE_DEFAULT },
  { name: 'grid', options: GRID_DEFAULT },
  { name: 'radial', options: RADIAL_DEFAULT },
  { name: 'concentric' },
  { name: 'force' },
];
