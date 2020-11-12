import { FormGeneratorData } from '../../../components/FormGenerator';
import * as LAYOUT from '../../../constants/layout-options';

export const layoutNames = [
  { label: 'Concentric', id: 'concentric' },
  { label: 'Force-Directed', id: 'force' },
  { label: 'Radial', id: 'radial' },
  { label: 'Grid', id: 'grid' },
  { label: 'Dagre', id: 'dagre' },
  { label: 'Circular', id: 'circle' },
];

const defaultLayoutForm: FormGeneratorData = {
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

export const genLayoutForm = (
  currentOptions: any,
  callback: (data: any) => void,
): FormGeneratorData => {
  const option = defaultLayoutForm;
  option.value = currentOptions.id || 'concentric';
  option.callback = callback;

  // override value for option if exist in currentOption
  if (option[currentOptions.id]) {
    Object.entries(currentOptions).forEach(([key, value]) => {
      const idx = option[currentOptions.id].findIndex((x: any) => x.id === key);
      if (idx > -1) {
        option[currentOptions.id][idx].value = value;
      }
    });
  }
  return option;
};
