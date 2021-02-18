import { EdgeStyle, NodeStyle } from '@antv/graphin';
import { ThemeType } from '@antv/graphin/lib/theme';
import { DEFAULT_EDGE_STYLE, DEFAULT_NODE_STYLE, grey } from './graph-shapes';

export const nodeStateStyles: { status: NodeStyle['status'] } = {
  status: {
    selected: DEFAULT_NODE_STYLE.status.selected,
    hover: {
      halo: {
        ...DEFAULT_NODE_STYLE.halo,
        visible: true,
      },
    },
    active: {
      halo: {
        visible: false,
      },
      keyshape: DEFAULT_NODE_STYLE.status.active.keyshape,
    },
    inactive: {
      keyshape: DEFAULT_NODE_STYLE.status.inactive.keyshape,
      label: DEFAULT_NODE_STYLE.status.inactive.label,
      icon: {
        type: 'font',
        fill: grey.dark,
        value: '',
        fontFamily: 'Material Icons',
        visible: true,
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
    selected: DEFAULT_EDGE_STYLE.status.selected,
    hover: DEFAULT_EDGE_STYLE.status.hover,
    disabled: DEFAULT_EDGE_STYLE.status.disabled,
    active: DEFAULT_EDGE_STYLE.status.active,
    inactive: DEFAULT_EDGE_STYLE.status.inactive,
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
      fillOpacity: DEFAULT_EDGE_STYLE.opacity - 0.1,
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
