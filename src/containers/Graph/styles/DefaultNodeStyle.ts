import { NodeStyle } from '@antv/graphin';
import { DEFAULT_NODE_STYLE, GREY } from '../shape/constants';
import { normalizeColor } from '../shape/utils';

const innerSize = DEFAULT_NODE_STYLE.size;
const outerSize = innerSize + 2;
const nodeLineWidth = 1;

const color = normalizeColor(DEFAULT_NODE_STYLE.color);
const grey = normalizeColor(GREY);

export const DefaultNodeStyle: { style: Partial<NodeStyle> } = {
  style: {
    badges: [],
    halo: {
      fill: grey.dark,
    },
    label: {
      position: 'bottom',
      fill: '#3B3B3B',
      fontSize: 12,
      offset: 0,
    },
    keyshape: {
      size: DEFAULT_NODE_STYLE.size,
      stroke: color.normal,
      fill: color.dark,
      lineWidth: 2,
      opacity: 1,
    },
    icon: {
      type: 'font',
      value: '',
      size: innerSize,
      fill: '#FFFFFF',
      fontFamily: 'Material Icons',
    },
  },
};

const selectedLineWidth = nodeLineWidth * 2;
export const DefaultNodeStatusStyle: {
  status: Partial<{}>;
} = {
  status: {
    selected: {
      badges: [],
      keyshape: {
        fill: '#000000',
        opacity: 0.05,
        lineWidth: selectedLineWidth,
        stroke: 'lightgreen',
      },
      icon: {
        fill: '#FFFFFF',
      },
      label: {
        fill: '#3B3B3B',
      },
      halo: {},
    },
    hover: {},
    active: {},
    inactive: {},
  },
};
