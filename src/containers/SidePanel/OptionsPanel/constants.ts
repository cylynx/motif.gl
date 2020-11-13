/* eslint-disable no-console */
import { SimpleFormData, NestedFormData } from '../../../components/form';
import * as LAYOUT from '../../../constants/layout-options';
import { DEFAULT_EDGE_STYLE, DEFAULT_NODE_STYLE } from '../../Graph';

export const layoutNames = [
  { label: 'Concentric', id: 'concentric' },
  { label: 'Force-Directed', id: 'force' },
  { label: 'Radial', id: 'radial' },
  { label: 'Grid', id: 'grid' },
  { label: 'Dagre', id: 'dagre' },
  { label: 'Circular', id: 'circle' },
];

export const layoutForm: NestedFormData = {
  id: 'layout',
  label: 'Layout',
  value: 'concentric',
  callback: (data: any) => console.log(data),
  options: layoutNames,
  dagre: [
    {
      id: 'rankSep',
      label: 'rankSep',
      type: 'slider',
      value: LAYOUT.DAGRE_DEFAULT.rankSep,
      min: 1,
      max: 500,
    },
    {
      id: 'nodeSep',
      label: 'nodeSep',
      type: 'slider',
      value: LAYOUT.DAGRE_DEFAULT.nodeSep,
      min: 1,
      max: 500,
    },
  ],
  circle: [
    {
      id: 'r',
      label: 'radius',
      type: 'slider',
      value: LAYOUT.CIRCLE_DEFAULT.r,
      min: 10,
      max: 300,
    },
  ],
  concentric: [
    {
      id: 'minNodeSpacing',
      label: 'minNodeSpacing',
      type: 'slider',
      value: LAYOUT.CONCENTRIC_DEFAULT.minNodeSpacing,
      min: 1,
      max: 300,
    },
  ],
  grid: [
    {
      id: 'nodeSep',
      label: 'nodeSep',
      type: 'slider',
      value: LAYOUT.GRID_DEFAULT.nodeSep,
      min: 1,
      max: 500,
    },
    {
      id: 'nodeSize',
      label: 'nodeSize',
      type: 'slider',
      value: LAYOUT.GRID_DEFAULT.nodeSize,
      min: 1,
      max: 100,
    },
  ],
  radial: [
    {
      id: 'unitRadius',
      label: 'radius',
      type: 'slider',
      value: LAYOUT.RADIAL_DEFAULT.unitRadius,
      min: 1,
      max: 500,
    },
    {
      id: 'nodeSize',
      label: 'nodeSize',
      type: 'slider',
      value: LAYOUT.RADIAL_DEFAULT.nodeSize,
      min: 1,
      max: 100,
    },
    {
      id: 'sortBy',
      label: 'sortBy',
      type: 'input',
      value: 'shape',
    },
  ],
};

export const nodeSizeForm: NestedFormData = {
  id: 'size',
  label: 'Node Size',
  value: 'fixed',
  callback: (data: any) => console.log(data),
  options: [
    { id: 'fixed', label: 'Fixed' },
    { id: 'degree', label: 'Degree (number of connections)' },
    { id: 'property', label: 'Property (user defined)' },
  ],
  fixed: [
    {
      id: 'value',
      label: 'Size',
      type: 'slider',
      value: DEFAULT_NODE_STYLE.size,
      min: 1,
      max: 100,
    },
  ],
  degree: [
    {
      id: 'range',
      label: 'Scaling range (min - max)',
      type: 'slider',
      value: [5, 20],
      min: 1,
      max: 50,
    },
  ],
  property: [
    {
      id: 'variable',
      label: 'Variable',
      type: 'select',
      value: 'number',
      options: [
        { id: 'number', label: 'number' },
        { id: 'number2', label: 'number2' },
      ],
    },
    {
      id: 'range',
      label: 'Scaling range (min - max)',
      type: 'slider',
      value: [5, 20],
      min: 1,
      max: 50,
    },
  ],
};

export const nodeColorForm: SimpleFormData = {
  id: 'color',
  label: 'Node Color',
  type: 'select',
  value: 'teal',
  options: [
    { id: 'teal', label: 'Teal' },
    { id: 'blue', label: 'Blue' },
    { id: 'green', label: 'Green' },
    { id: 'orange', label: 'Orange' },
  ],
  callback: (data: any) => console.log(data),
};

export const nodeFontSizeForm: SimpleFormData = {
  id: 'fontSize',
  label: 'Font Size',
  type: 'slider',
  value: 12,
  min: 0,
  max: 50,
  callback: (data: any) => console.log(data),
};
