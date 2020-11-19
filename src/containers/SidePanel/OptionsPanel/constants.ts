/* eslint-disable no-console */
import { SimpleFormData, NestedFormData } from '../../../components/form';
import * as LAYOUT from '../../../constants/layout-options';
import { DEFAULT_EDGE_STYLE, DEFAULT_NODE_STYLE } from '../../Graph';

export const layoutForm: NestedFormData = {
  id: 'layout',
  label: 'Layout',
  value: 'concentric',
  callback: (data: any) => console.log(data),
  options: LAYOUT.LAYOUT_NAMES,
  dagre: [
    {
      id: 'rankSep',
      label: 'Vertical Spacing',
      type: 'slider',
      value: LAYOUT.DAGRE_DEFAULT.rankSep,
      min: 1,
      max: 500,
    },
    {
      id: 'nodeSep',
      label: 'Horizontal Spacing',
      type: 'slider',
      value: LAYOUT.DAGRE_DEFAULT.nodeSep,
      min: 1,
      max: 500,
    },
  ],
  circle: [
    {
      id: 'r',
      label: 'Radius',
      type: 'slider',
      value: LAYOUT.CIRCLE_DEFAULT.r,
      min: 10,
      max: 300,
    },
  ],
  concentric: [
    {
      id: 'minNodeSpacing',
      label: 'Node Spacing',
      type: 'slider',
      value: LAYOUT.CONCENTRIC_DEFAULT.minNodeSpacing,
      min: 1,
      max: 1000,
    },
  ],
  grid: [
    {
      id: 'nodeSep',
      label: 'Spacing',
      type: 'slider',
      value: LAYOUT.GRID_DEFAULT.nodeSep,
      min: 1,
      max: 1000,
    },
  ],
  radial: [
    {
      id: 'unitRadius',
      label: 'Radius',
      type: 'slider',
      value: LAYOUT.RADIAL_DEFAULT.unitRadius,
      min: 1,
      max: 500,
    },
    {
      id: 'nodeSize',
      label: 'Node Spacing',
      type: 'slider',
      value: LAYOUT.RADIAL_DEFAULT.nodeSize,
      min: 1,
      max: 200,
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

export const nodeColorForm: NestedFormData = {
  id: 'color',
  label: 'Node Color',
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
      type: 'select',
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
      type: 'select',
      value: null,
      options: [],
    },
  ],
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

export const nodeLabelForm: SimpleFormData = {
  id: 'label',
  label: 'Label',
  type: 'select',
  value: 'label',
  options: [{ id: 'label', label: 'label' }],
  callback: (data: any) => console.log(data),
};

export const edgeWidthForm: NestedFormData = {
  id: 'width',
  label: 'Edge Width',
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
      type: 'slider',
      value: DEFAULT_EDGE_STYLE.width,
      min: 0.1,
      max: 25,
      step: 0.1,
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
      value: [1, 5],
      min: 0.1,
      max: 25,
      step: 0.1,
    },
  ],
};

export const edgePatternForm: SimpleFormData = {
  id: 'pattern',
  label: 'Edge Pattern',
  type: 'select',
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
  type: 'slider',
  value: 12,
  min: 0,
  max: 50,
  callback: (data: any) => console.log(data),
};

export const edgeLabelForm: SimpleFormData = {
  id: 'label',
  label: 'Label',
  type: 'select',
  value: 'none',
  options: [{ id: 'none', label: 'None' }],
  callback: (data: any) => console.log(data),
};
