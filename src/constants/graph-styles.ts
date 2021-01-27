import { EdgeStyle, NodeStyle } from '@antv/graphin';
import { DEFAULT_EDGE_STYLE, DEFAULT_NODE_STYLE, GREY } from './graph-shapes';
import { normalizeColor } from '../utils/style-utils';
import { mapEdgePattern } from '../containers/Graph/shape/utils';

const nodeSize = DEFAULT_NODE_STYLE.size;
const nodeLineWidth = 3;
const nodeColor = normalizeColor(DEFAULT_NODE_STYLE.color);
const grey = normalizeColor(GREY);

const selectedLineWidth = nodeLineWidth * 2;
export const defaultNodeStateStyle: {
  status: Partial<{}>;
} = {
  status: {
    selected: {
      badges: [],
      keyshape: {
        fill: '#000000',
        opacity: 0.05,
        lineWidth: selectedLineWidth,
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

export const defaultNodeStyle: { style: Partial<NodeStyle> } = {
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
      stroke: nodeColor.normal,
      fill: nodeColor.dark,
      lineWidth: nodeLineWidth,
      opacity: 1,
    },
    icon: {
      type: 'font',
      value: '',
      size: nodeSize,
      fill: '#FFFFFF',
      fontFamily: 'Material Icons',
    },
  },
};

const edgeLineColor = normalizeColor(DEFAULT_EDGE_STYLE.color);
const edgeFontColor = normalizeColor(DEFAULT_EDGE_STYLE.fontColor);
const edgeLinePattern = mapEdgePattern(DEFAULT_EDGE_STYLE.pattern);

export const defaultEdgeStateStyle: {
  status: Partial<
    Partial<{
      selected: Partial<EdgeStyle>;
      hover: Partial<EdgeStyle>;
      disabled: Partial<EdgeStyle>;
    }>
  >;
} = {
  status: {
    selected: {
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.width + 1,
      },
    },
    hover: {
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.width + 1,
      },
    },
    disabled: {
      label: {
        fill: grey.dark,
      },
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.width,
        opacity: 0.6,
      },
    },
  },
};

export const defaultEdgeStyle: { style: Partial<EdgeStyle> } = {
  style: {
    halo: {
      lineWidth: DEFAULT_EDGE_STYLE.width + 3,
      opacity: 1,
      cursor: 'pointer',
    },
    label: {
      position: 'T',
      autoRote: true,
      fill: edgeFontColor.dark,
      fontFamily: DEFAULT_EDGE_STYLE.fontFamily,
    },
    keyshape: {
      lineWidth: DEFAULT_EDGE_STYLE.width,
      stroke: edgeLineColor.dark,
      opacity: 0.8,
      lineDash: edgeLinePattern,
      lineAppendWidth: 4,
      cursor: 'pointer',
    },
  },
};
