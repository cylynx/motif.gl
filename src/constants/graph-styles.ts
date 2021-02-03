import { EdgeStyle, NodeStyle } from '@antv/graphin';
import { ThemeType } from '@antv/graphin/lib/consts';
import { DEFAULT_EDGE_STYLE, DEFAULT_NODE_STYLE, GREY } from './graph-shapes';
import { normalizeColor } from '../utils/style-utils';
import { mapEdgePattern } from '../containers/Graph/shape/utils';

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
      label: {
        fill: '#000000',
      },
      halo: {
        visible: false,
        opacity: 0.4,
        fillOpacity: 0.9,
        strokeOpacity: 0.9,
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
        size: [nodeSize, nodeSize],
        fillOpacity: 0.3,
        lineWidth: nodeLineWidth,
        opacity: 1,
        strokeOpacity: 1,
      },
      label: {
        position: 'bottom',
        offset: nodeLabelOffset,
        fill: '#000000',
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
      size: nodeSize * 2,
      visible: false,
      lineWidth: 2,
      fill: grey.normal,
      stroke: grey.dark,
      opacity: 0.8,
      fillOpacity: 0.2,
      strokeOpacity: 0.5,
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
    disable: {
      label: {
        fill: grey.normal,
        fillOpacity: 0.8,
      },
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.width,
        fill: grey.normal,
        fillOpacity: 0.8,
        opacity: 0.6,
      },
    },
    active: {
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.width + 0.5,
      },
    },
    inactive: {
      label: {
        fill: grey.normal,
        fillOpacity: 0.8,
      },
      keyshape: {
        lineWidth: DEFAULT_EDGE_STYLE.width,
        fill: grey.reflect,
        fillOpacity: 0.5,
        opacity: 0.5,
      },
    },
  },
};

export const defaultEdge: { style: Partial<EdgeStyle> } = {
  style: {
    halo: {
      lineWidth: DEFAULT_EDGE_STYLE.width + 2,
      opacity: 0.5,
      cursor: 'pointer',
    },
    label: {
      fill: edgeFontColor.dark,
    },
    keyshape: {
      lineWidth: DEFAULT_EDGE_STYLE.width,
      stroke: edgeLineColor.dark,
      opacity: 0.8,
      lineDash: edgeLinePattern,
      lineAppendWidth: 4,
      cursor: 'pointer',
      endArrow: DEFAULT_EDGE_STYLE.endArrow,
    },
  },
};

export const lightTheme: ThemeType = {
  mode: 'light',
  primaryColor: DEFAULT_NODE_STYLE.color,
  nodeSize: DEFAULT_NODE_STYLE.size,
  edgeSize: DEFAULT_EDGE_STYLE.width,
  edgePrimaryColor: DEFAULT_EDGE_STYLE.color,
  background: '#FFFFFF',
};

export const darkTheme: ThemeType = {
  mode: 'dark',
  primaryColor: DEFAULT_NODE_STYLE.color,
  nodeSize: DEFAULT_NODE_STYLE.size,
  edgeSize: DEFAULT_EDGE_STYLE.width,
  edgePrimaryColor: '#f5f2f2',
  background: '#000000',
};
