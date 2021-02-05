import { EdgeStyle, NodeStyle } from '@antv/graphin';
import { ThemeType } from '@antv/graphin/lib/theme';
import { DEFAULT_EDGE_STYLE, DEFAULT_NODE_STYLE, grey } from './graph-shapes';

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

export const edgeStateStyles: {
  status: EdgeStyle['status'];
} = {
  status: {
    selected: {
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.lineWidth + 0.5,
      },
    },
    hover: {
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.lineWidth + 1,
      },
    },
    disabled: {
      label: {
        fill: DEFAULT_EDGE_STYLE.status.disabled.label.fill,
        fillOpacity: DEFAULT_EDGE_STYLE.opacity - 0.7,
      },
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.lineWidth - 0.5,
        strokeOpacity: DEFAULT_EDGE_STYLE.opacity - 0.7,
        opacity: DEFAULT_EDGE_STYLE.opacity - 0.7,
      },
    },
    active: {
      keyshape: {
        stroke: DEFAULT_EDGE_STYLE.status.active.keyshape.stroke,
        lineWidth: DEFAULT_EDGE_STYLE.lineWidth + 1,
      },
    },
    inactive: {
      label: {
        fill: grey.normal,
        fillOpacity: DEFAULT_EDGE_STYLE.opacity - 0.3,
      },
      keyshape: {
        stroke: grey.normal,
        strokeOpacity: DEFAULT_EDGE_STYLE.opacity - 0.3,
        opacity: DEFAULT_EDGE_STYLE.opacity - 0.3,
      },
    },
  },
};

export const defaultEdge: { style: Partial<EdgeStyle> } = {
  style: {
    halo: {
      lineWidth: DEFAULT_EDGE_STYLE.lineWidth + 1,
      opacity: 0.5,
      cursor: 'pointer',
      visible: false,
    },
    label: {
      fill: DEFAULT_EDGE_STYLE.label.fill,
      fillOpacity: DEFAULT_EDGE_STYLE.lineWidth - 0.1,
      offset: DEFAULT_EDGE_STYLE.label.offset,
    },
    keyshape: {
      strokeOpacity: DEFAULT_EDGE_STYLE.opacity,
      opacity: DEFAULT_EDGE_STYLE.opacity,
      lineWidth: DEFAULT_EDGE_STYLE.lineWidth,
      ...DEFAULT_EDGE_STYLE.keyshape,
    },
  },
};

export const lightTheme: ThemeType = {
  mode: 'light',
  primaryColor: DEFAULT_NODE_STYLE.color,
  nodeSize: DEFAULT_NODE_STYLE.keyshape.size,
  edgeSize: DEFAULT_EDGE_STYLE.lineWidth,
  primaryEdgeColor: DEFAULT_EDGE_STYLE.color,
  background: '#FFFFFF',
};

export const darkTheme: ThemeType = {
  mode: 'dark',
  primaryColor: DEFAULT_NODE_STYLE.color,
  nodeSize: DEFAULT_NODE_STYLE.keyshape.size,
  edgeSize: DEFAULT_EDGE_STYLE.lineWidth,
  primaryEdgeColor: '#f5f2f2',
  background: '#000000',
};
