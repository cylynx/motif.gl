/* eslint-disable no-console */
import { SimpleFormData, NestedFormData } from '../../../components/form';
import * as LAYOUT from '../../../constants/layout-options';
import {
  DEFAULT_EDGE_STYLE,
  DEFAULT_NODE_STYLE,
} from '../../../constants/graph-shapes';

export const layoutForm: NestedFormData = {
  id: 'layout',
  label: 'Layout',
  labelPosition: 'top',
  value: 'concentric',
  callback: (data: any) => console.log(data),
  options: LAYOUT.LAYOUT_NAMES,
  dagre: [
    {
      id: 'rankSep',
      label: 'Vertical Spacing',
      kind: 'slider',
      value: LAYOUT.DAGRE_DEFAULT.rankSep,
      min: 1,
      max: 500,
    },
    {
      id: 'nodeSep',
      label: 'Horizontal Spacing',
      kind: 'slider',
      value: LAYOUT.DAGRE_DEFAULT.nodeSep,
      min: 1,
      max: 500,
    },
    {
      id: 'rankdir',
      label: 'Direction',
      kind: 'select',
      value: 'TB',
      options: [
        { id: 'TB', label: 'Top to Bottom' },
        { id: 'BT', label: 'Bottom to Top' },
        { id: 'LR', label: 'Left to Right' },
        { id: 'RL', label: 'Right to Left' },
      ],
    },
  ],
  circular: [
    {
      id: 'startRadius',
      label: 'Start Radius',
      kind: 'slider',
      value: LAYOUT.CIRCLE_DEFAULT.startRadius,
      min: 10,
      max: 500,
    },
    {
      id: 'endRadius',
      label: 'End Radius',
      kind: 'slider',
      value: LAYOUT.CIRCLE_DEFAULT.endRadius,
      min: 0,
      max: 500,
    },
    {
      id: 'angleRatio',
      label: 'Angle',
      kind: 'slider',
      value: LAYOUT.CIRCLE_DEFAULT.angleRatio,
      min: 0.1,
      max: 1,
      step: 0.1,
    },
    {
      id: 'divisions',
      label: 'Divisions',
      kind: 'slider',
      value: LAYOUT.CIRCLE_DEFAULT.divisions,
      min: 1,
      max: 10,
      step: 1,
    },
  ],
  concentric: [
    {
      id: 'minNodeSpacing',
      label: 'Node Spacing',
      kind: 'slider',
      value: LAYOUT.CONCENTRIC_DEFAULT.minNodeSpacing,
      min: 1,
      max: 100,
    },
    {
      id: 'sortBy',
      label: 'Sort By',
      kind: 'select',
      value: 'degree',
      options: [{ id: 'degree', label: 'degree' }],
    },
  ],
  'graphin-force': [],
  fruchterman: [
    {
      id: 'gravity',
      label: 'Gravity',
      kind: 'slider',
      value: LAYOUT.FRUCHTERMAN_DEFAULT.gravity,
      min: 1,
      max: 100,
      step: 1,
    },
    {
      id: 'clusterGravity',
      label: 'Cluster Gravity',
      kind: 'slider',
      value: LAYOUT.FRUCHTERMAN_DEFAULT.clusterGravity,
      min: 1,
      max: 100,
      step: 1,
    },
  ],
  grid: [
    {
      id: 'rows',
      label: 'No. of Rows',
      kind: 'slider',
      value: LAYOUT.GRID_DEFAULT.rows,
      min: 1,
      max: 10,
    },
    {
      id: 'sortBy',
      label: 'Sort By',
      kind: 'select',
      value: 'degree',
      options: [{ id: 'degree', label: 'degree' }],
    },
  ],
  radial: [
    {
      id: 'unitRadius',
      label: 'Radius',
      kind: 'slider',
      value: LAYOUT.RADIAL_DEFAULT.unitRadius,
      min: 1,
      max: 500,
    },
    {
      id: 'linkDistance',
      label: 'Node Spacing',
      kind: 'slider',
      value: LAYOUT.RADIAL_DEFAULT.linkDistance,
      min: 1,
      max: 500,
    },
    {
      id: 'focusNode',
      label: 'Focus Node',
      kind: 'batchSelect',
      value: '',
      options: [{ id: '', label: '' }],
      labelKey: 'label',
      valueKey: 'id',
    },
  ],
};

export const nodeSizeForm: NestedFormData = {
  id: 'size',
  label: 'Node Size',
  labelPosition: 'top',
  value: 'fixed',
  callback: (data: any) => console.log(data),
  options: [
    { id: 'fixed', label: 'Fixed' },
    { id: 'degree', label: 'Degree (no. of connections)' },
    { id: 'property', label: 'Property (user defined)' },
  ],
  fixed: [
    {
      id: 'value',
      label: 'Size',
      kind: 'slider',
      value: DEFAULT_NODE_STYLE.keyshape.size,
      min: 1,
      max: 100,
    },
  ],
  degree: [
    {
      id: 'range',
      label: 'Scaling range (min - max)',
      kind: 'slider',
      value: [15, 30],
      min: 1,
      max: 50,
    },
  ],
  property: [
    {
      id: 'variable',
      label: 'Variable',
      kind: 'select',
      value: 'number',
      options: [
        { id: 'number', label: 'number' },
        { id: 'number2', label: 'number2' },
      ],
    },
    {
      id: 'range',
      label: 'Scaling range (min - max)',
      kind: 'slider',
      value: [15, 30],
      min: 1,
      max: 50,
    },
  ],
};

export const nodeColorForm: NestedFormData = {
  id: 'color',
  label: 'Node Color',
  labelPosition: 'top',
  value: 'fixed',
  callback: (data: any) => console.log(data),
  options: [
    { id: 'fixed', label: 'Fixed' },
    { id: 'legend', label: 'Legend' },
  ],
  fixed: [
    {
      id: 'value',
      label: 'Value',
      kind: 'select',
      value: 'teal',
      options: [
        { id: 'teal', label: 'Teal' },
        { id: 'blue', label: 'Blue' },
        { id: 'green', label: 'Green' },
        { id: 'orange', label: 'Orange' },
      ],
    },
  ],
  legend: [
    {
      id: 'variable',
      label: 'Variable',
      kind: 'select',
      value: null,
      options: [],
    },
  ],
};

export const nodeFontSizeForm: SimpleFormData = {
  id: 'fontSize',
  label: 'Font Size',
  labelPosition: 'top',
  kind: 'slider',
  value: 12,
  min: 0,
  max: 50,
  callback: (data: any) => console.log(data),
};

export const nodeLabelForm: SimpleFormData = {
  id: 'label',
  label: 'Label',
  labelPosition: 'top',
  kind: 'select',
  value: '-',
  options: [{ id: '-', label: '-' }],
  callback: (data: any) => console.log(data),
};

export const edgeWidthForm: NestedFormData = {
  id: 'width',
  label: 'Edge Width',
  labelPosition: 'top',
  value: 'fixed',
  callback: (data: any) => console.log(data),
  options: [
    { id: 'fixed', label: 'Fixed' },
    { id: 'property', label: 'Property (user defined)' },
  ],
  fixed: [
    {
      id: 'value',
      label: 'Width',
      kind: 'slider',
      value: DEFAULT_EDGE_STYLE.lineWidth,
      min: 1,
      max: 10,
      step: 0.1,
    },
  ],
  property: [
    {
      id: 'variable',
      label: 'Variable',
      kind: 'select',
      value: 'number',
      options: [
        { id: 'number', label: 'number' },
        { id: 'number2', label: 'number2' },
      ],
    },
    {
      id: 'range',
      label: 'Scaling range (min - max)',
      kind: 'slider',
      value: [1, 5],
      min: 1,
      max: 10,
      step: 0.1,
    },
  ],
};

export const edgePatternForm: SimpleFormData = {
  id: 'pattern',
  label: 'Edge Pattern',
  labelPosition: 'top',
  kind: 'select',
  value: 'none',
  options: [
    { id: 'none', label: 'None' },
    { id: 'dot', label: 'Dot' },
    { id: 'dash', label: 'Dash' },
    { id: 'dash-dot', label: 'dash-dot' },
  ],
  callback: (data: any) => console.log(data),
};

export const edgeFontSizeForm: SimpleFormData = {
  id: 'fontSize',
  label: 'Font Size',
  labelPosition: 'top',
  kind: 'slider',
  value: 12,
  min: 0,
  max: 50,
  callback: (data: any) => console.log(data),
};

export const edgeLabelForm: SimpleFormData = {
  id: 'label',
  label: 'Label',
  labelPosition: 'top',
  kind: 'select',
  value: '-',
  options: [{ id: '-', label: '-' }],
  callback: (data: any) => console.log(data),
};

export const edgeArrowForm: SimpleFormData = {
  id: 'arrow',
  label: 'Arrow',
  labelPosition: 'top',
  kind: 'select',
  value: 'display',
  options: [
    { id: 'none', label: 'None' },
    { id: 'display', label: 'Display' },
  ],
  callback: (data: any) => console.log(data),
};
