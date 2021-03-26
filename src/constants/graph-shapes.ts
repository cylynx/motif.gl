import { GREY, PRIMARY_COLOR } from './colors';
import { EdgePattern, mapEdgePattern } from '../utils/shape-utils';
import { normalizeColor } from '../utils/style-utils';

export const EDGE_DEFAULT_COLOR = 'rgba(105, 123, 140,1)';
export const EDGE_LABEL_DEFAULT_COLOR = 'rgba(59, 59, 59,1)';
export const HIDDEN_LABEL_COLOR = 'rgba(238, 238, 238,1)';
export const HIDDEN_LINE_COLOR = 'rgba(238, 238, 238,1)';
export const PRIMARY_NODE_COLOR = PRIMARY_COLOR;

export const DEFAULT_ICON_FONT_FAMILY = `-apple-system, system-ui, BlinkMacSystemFont,
'Segoe UI', Roboto, 'Helvetica Neue',
Ubuntu, Arial, sans-serif`;

export enum EnumNodeAndEdgeStatus {
  SELECTED = 'selected',
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  HOVERED = 'hover',
  DISABLED = 'disabled',
}

export const interactionStates = [
  EnumNodeAndEdgeStatus.SELECTED,
  EnumNodeAndEdgeStatus.HOVERED,
  EnumNodeAndEdgeStatus.INACTIVE,
  EnumNodeAndEdgeStatus.ACTIVE,
  EnumNodeAndEdgeStatus.DISABLED,
];

const nodeOpacity = 1;
const nodeShapeLineWidth = 3;
export const grey = normalizeColor(GREY);
export const nodeColor = normalizeColor(PRIMARY_NODE_COLOR);
export const DEFAULT_NODE_STYLE = {
  color: PRIMARY_NODE_COLOR,
  opacity: nodeOpacity,
  lineWidth: nodeShapeLineWidth,
  label: {
    position: 'bottom',
    fill: '#3b3b3b',
    fontSize: 12,
    offset: [0, 3],
  },
  keyshape: {
    size: 20,
    stroke: nodeColor.normal,
    fill: nodeColor.dark,
    fillOpacity: nodeOpacity - 0.7,
    lineWidth: nodeShapeLineWidth,
    opacity: nodeOpacity,
    strokeOpacity: nodeOpacity,
  },
  halo: {
    lineWidth: 4,
    opacity: nodeOpacity - 0.2,
    fillOpacity: nodeOpacity - 0.5,
    strokeOpacity: nodeOpacity - 0.5,
    shadowBlur: 2,
  },
  status: {
    selected: {
      keyshape: {
        fillOpacity: nodeOpacity,
        lineWidth: nodeShapeLineWidth,
        opacity: nodeOpacity,
      },
      halo: {
        visible: false,
      },
    },
    inactive: {
      keyshape: {
        fill: grey.normal,
        shadowColor: grey.reflect,
        stroke: grey.dark,
        shadowBlur: 2,
        strokeOpacity: nodeOpacity - 0.8,
        lineWidth: nodeShapeLineWidth - 1,
        fillOpacity: nodeOpacity - 0.8,
      },
      label: {
        position: 'bottom',
      },
    },
    active: {
      keyshape: {
        fillOpacity: nodeOpacity - 0.7,
        strokeOpacity: nodeOpacity,
        opacity: nodeOpacity,
        lineWidth: nodeShapeLineWidth,
      },
    },
  },
};

export type NodeStyleType = Partial<typeof DEFAULT_NODE_STYLE>;
export type NodeStyleKey = keyof typeof DEFAULT_NODE_STYLE;

export const EDGE_DEFAULT_PATTERN: EdgePattern = null;

const edgeLineWidth = 1;
const edgeOpacity = 1;
export const edgeLineColor = normalizeColor(EDGE_DEFAULT_COLOR);
export const edgeFontColor = normalizeColor(EDGE_LABEL_DEFAULT_COLOR);
export const edgeLinePattern = mapEdgePattern(EDGE_DEFAULT_PATTERN);
export const DEFAULT_EDGE_STYLE = {
  color: EDGE_DEFAULT_COLOR,
  lineWidth: edgeLineWidth,
  opacity: edgeOpacity,
  label: {
    fill: edgeFontColor.dark,
    fontSize: 12,
    textAlign: 'center',
    offset: [0, 5],
  },
  keyshape: {
    stroke: edgeLineColor.dark,
    lineDash: edgeLinePattern,
    cursor: 'pointer',
    shadowColor: 'transparent',
    lineAppendWidth: 9,
    endArrow: {
      d: -1 / 2,
      path: `M 0,0 L 4,2 L 4,-2 Z`,
      fill: EDGE_DEFAULT_COLOR,
    },
  },
  status: {
    selected: {
      keyshape: {
        lineWidth: edgeLineWidth + 0.5,
      },
      halo: {
        visible: false,
      },
    },
    hover: {
      keyshape: {
        lineWidth: edgeLineWidth + 1,
      },
      halo: {
        visible: true,
      },
    },
    disabled: {
      label: {
        fill: edgeFontColor.reflect,
        fillOpacity: edgeOpacity - 0.7,
      },
      keyshape: {
        lineWidth: edgeLineWidth - 0.5,
        stroke: '#ddd',
        endArrow: {
          d: -1 / 2,
          path: `M 0,0 L 4,2 L 4,-2 Z`,
          fill: '#ddd',
        },
      },
      halo: {
        visible: false,
      },
    },
    active: {
      keyshape: {
        stroke: edgeLineColor.dark,
        lineWidth: edgeLineWidth + 1,
      },
      halo: {
        visible: false,
      },
    },
    inactive: {
      label: {
        fill: grey.normal,
        fillOpacity: edgeOpacity - 0.3,
      },
      keyshape: {
        stroke: grey.normal,
        strokeOpacity: edgeOpacity - 0.3,
        opacity: edgeOpacity - 0.3,
      },
      halo: {
        visible: false,
      },
    },
  },
};

export type EdgeStyleType = Partial<typeof DEFAULT_EDGE_STYLE>;
export type EdgeStyleKey = keyof typeof DEFAULT_EDGE_STYLE;
