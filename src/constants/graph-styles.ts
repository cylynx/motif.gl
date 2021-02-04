import { EdgeStyle, NodeStyle } from '@antv/graphin';
import { ThemeType } from '@antv/graphin/lib/theme';
import { DEFAULT_EDGE_STYLE, DEFAULT_NODE_STYLE, GREY } from './graph-shapes';
import { normalizeColor } from '../utils/style-utils';
import { mapEdgePattern } from '../utils/shape-utils';

const grey = normalizeColor(GREY);
export const nodeStateStyles: { status: NodeStyle['status'] } = {
  status: {
    selected: {
      badges: [],
      keyshape: {
        fillOpacity: DEFAULT_NODE_STYLE.status.selected.keyshape.opacity,
        lineWidth: DEFAULT_NODE_STYLE.keyshape.lineWidth,
      },
      halo: {
        visible: false,
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
        fillOpacity: DEFAULT_NODE_STYLE.status.active.keyshape.opacity,
        lineWidth: DEFAULT_NODE_STYLE.keyshape.lineWidth,
        opacity: 1,
        strokeOpacity: 1,
      },
      label: {
        position: 'bottom',
        offset: DEFAULT_NODE_STYLE.label.offset,
      },
    },
    inactive: {
      keyshape: {
        fill: grey.normal,
        shadowColor: grey.reflect,
        stroke: grey.dark,
        shadowBlur: 2,
        strokeOpacity: DEFAULT_NODE_STYLE.status.inactive.keyshape.opacity,
        lineWidth: DEFAULT_NODE_STYLE.keyshape.lineWidth - 1,
        fillOpacity: DEFAULT_NODE_STYLE.status.inactive.keyshape.opacity,
      },
      label: {
        position: 'bottom',
        offset: DEFAULT_NODE_STYLE.label.offset,
      },
      icon: {
        type: 'font',
        fill: grey.dark,
        fontFamily: 'Material Icons',
      },
    },
  },
};

export const defaultNode: { style: Partial<NodeStyle> } = {
  style: {
    badges: [],
    halo: {
      visible: false,
      ...DEFAULT_NODE_STYLE.halo,
    },
    label: DEFAULT_NODE_STYLE.label,
    keyshape: DEFAULT_NODE_STYLE.keyshape,
    icon: {
      type: 'font',
      value: '',
      size: DEFAULT_NODE_STYLE.keyshape.size,
      fill: DEFAULT_NODE_STYLE.color,
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
  nodeSize: DEFAULT_NODE_STYLE.keyshape.size,
  edgeSize: DEFAULT_EDGE_STYLE.width,
  primaryEdgeColor: DEFAULT_EDGE_STYLE.color,
  background: '#FFFFFF',
};

export const darkTheme: ThemeType = {
  mode: 'dark',
  primaryColor: DEFAULT_NODE_STYLE.color,
  nodeSize: DEFAULT_NODE_STYLE.keyshape.size,
  edgeSize: DEFAULT_EDGE_STYLE.width,
  primaryEdgeColor: '#f5f2f2',
  background: '#000000',
};
