import { EdgeStyle, NodeStyle } from '@antv/graphin';
import { ThemeType } from '@antv/graphin/lib/theme';
import { DEFAULT_EDGE_STYLE, DEFAULT_NODE_STYLE, GREY } from './graph-shapes';
import { normalizeColor } from '../utils/style-utils';
import { mapEdgePattern } from '../utils/shape-utils';

const nodeSize = DEFAULT_NODE_STYLE.size;
const nodeLineWidth = 3;
const nodeColor = normalizeColor(DEFAULT_NODE_STYLE.color);
const nodeLabelOffset: number[] = [0, 3];
const grey = normalizeColor(GREY);

export const nodeStateStyles: { status: NodeStyle['status'] } = {
  status: {
    selected: {
      badges: [],
      keyshape: {
        fillOpacity: 1.0,
        lineWidth: nodeLineWidth,
      },
      halo: {
        visible: false,
      },
      icon: {
        fill: '#FFFFFF',
      },
    },
    hover: {
      halo: {
        visible: true,
      },
    },
    active: {
      halo: {
        visible: false,
      },
      keyshape: {
        fillOpacity: 0.3,
        lineWidth: nodeLineWidth,
        opacity: 1,
        strokeOpacity: 1,
      },
      label: {
        position: 'bottom',
        offset: nodeLabelOffset,
      },
    },
    inactive: {
      keyshape: {
        fill: grey.normal,
        shadowColor: grey.reflect,
        stroke: grey.dark,
        shadowBlur: 2,
        strokeOpacity: 0.2,
        lineWidth: 2,
        fillOpacity: 0.3,
      },
      label: {
        position: 'bottom',
        offset: nodeLabelOffset,
      },
      icon: {
        type: 'font',
        fill: grey.dark,
        fontFamily: 'Material Icons',
      },
    },
    disable: {},
  },
};

export const defaultNode: { style: Partial<NodeStyle> } = {
  style: {
    badges: [],
    halo: {
      visible: false,
      lineWidth: 2,
      fill: grey.normal,
      stroke: grey.dark,
      opacity: 0.8,
      fillOpacity: 0.2,
      strokeOpacity: 0.5,
      shadowBlur: 2,
    },
    label: {
      position: 'bottom',
      fill: '#3B3B3B',
      fontSize: 12,
      offset: nodeLabelOffset,
    },
    keyshape: {
      size: [nodeSize, nodeSize],
      stroke: nodeColor.normal,
      fill: nodeColor.dark,
      fillOpacity: 0.3,
      lineWidth: nodeLineWidth,
      opacity: 1,
      strokeOpacity: 1,
    },
    icon: {
      type: 'font',
      value: '',
      size: nodeSize,
      fill: nodeColor.dark,
      fontFamily: 'Material Icons',
    },
  },
};

const edgeLineColor = normalizeColor(DEFAULT_EDGE_STYLE.color);
const edgeFontColor = normalizeColor(DEFAULT_EDGE_STYLE.fontColor);
const edgeLinePattern = mapEdgePattern(DEFAULT_EDGE_STYLE.pattern);

export const edgeStateStyles: {
  status: EdgeStyle['status'];
} = {
  status: {
    selected: {
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.width + 0.5,
      },
    },
    hover: {
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.width + 1,
      },
    },
    disabled: {
      label: {
        fill: edgeFontColor.reflect,
        fillOpacity: 0.3,
      },
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.width - 0.5,
        strokeOpacity: 0.3,
        opacity: 0.3,
      },
    },
    active: {
      keyshape: {
        stroke: edgeLineColor.dark,
        lineWidth: DEFAULT_EDGE_STYLE.width + 1,
      },
    },
    inactive: {
      label: {
        fill: grey.normal,
        fillOpacity: 0.7,
      },
      keyshape: {
        stroke: grey.normal,
        strokeOpacity: 0.7,
        opacity: 0.7,
      },
    },
  },
};

export const defaultEdge: { style: Partial<EdgeStyle> } = {
  style: {
    halo: {
      lineWidth: DEFAULT_EDGE_STYLE.width + 1,
      opacity: 0.5,
      cursor: 'pointer',
      visible: false,
    },
    label: {
      fill: edgeFontColor.dark,
      fillOpacity: 0.9,
    },
    keyshape: {
      lineWidth: DEFAULT_EDGE_STYLE.width,
      stroke: edgeLineColor.dark,
      strokeOpacity: 1.0,
      opacity: 1.0,
      lineDash: edgeLinePattern,
      cursor: 'pointer',
      endArrow: DEFAULT_EDGE_STYLE.endArrow,
      shadowColor: 'transparent',
    },
  },
};

export const lightTheme: ThemeType = {
  mode: 'light',
  primaryColor: DEFAULT_NODE_STYLE.color,
  nodeSize: DEFAULT_NODE_STYLE.size,
  edgeSize: DEFAULT_EDGE_STYLE.width,
  primaryEdgeColor: DEFAULT_EDGE_STYLE.color,
  background: '#FFFFFF',
};

export const darkTheme: ThemeType = {
  mode: 'dark',
  primaryColor: DEFAULT_NODE_STYLE.color,
  nodeSize: DEFAULT_NODE_STYLE.size,
  edgeSize: DEFAULT_EDGE_STYLE.width,
  primaryEdgeColor: '#f5f2f2',
  background: '#000000',
};
