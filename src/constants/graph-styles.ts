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

const selectedLineWidth = nodeLineWidth * 2;
export const nodeStateStyles: { status: NodeStyle['status'] } = {
  status: {
    selected: {
      badges: [],
      keyshape: {
        opacity: 0.05,
        lineWidth: selectedLineWidth,
        size: nodeSize,
      },
      icon: {
        fill: '#FFFFFF',
      },
      label: {
        fill: '#3B3B3B',
      },
      halo: {
        visible: true,
      },
    },
    hover: {
      halo: {
        visible: true,
      },
    },
    active: {
      halo: {
        size: nodeSize * 2,
        visible: false,
        lineWidth: 2,
        opacity: 0.8,
        fillOpacity: 0.5,
        strokeOpacity: 0.5,
      },
      label: {
        position: 'bottom',
        offset: nodeLabelOffset,
        fill: '#000000',
      },
    },
    inactive: {
      keyshape: {
        fill: grey.dark,
        shadowColor: grey.dark,
        shadowBlur: 2,
        strokeOpacity: 0.2,
        lineWidth: 2,
        stroke: grey.normal,
        fillOpacity: 0.3,
      },
      label: {
        position: 'bottom',
        offset: nodeLabelOffset,
      },
      icon: {
        type: 'font',
        value: '',
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
      opacity: 0.8,
      fillOpacity: 0.2,
      strokeOpacity: 0.5,
      stroke: nodeColor.dark,
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
    active: {},
    inactive: {
      keyshape: {
        fill: grey.dark,
      },
    },
    disable: {},
  },
};

export const defaultEdge: { style: Partial<EdgeStyle> } = {
  style: {
    halo: {
      lineWidth: DEFAULT_EDGE_STYLE.width + 3,
      opacity: 1,
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
