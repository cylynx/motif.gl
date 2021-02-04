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

export const grey = normalizeColor(GREY);
export const nodeColor = normalizeColor(PRIMARY_NODE_COLOR);
export const DEFAULT_NODE_STYLE = {
  color: PRIMARY_NODE_COLOR,
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
    fillOpacity: 0.3,
    lineWidth: 3,
    opacity: 1,
    strokeOpacity: 1,
  },
  halo: {
    lineWidth: 2,
    fill: grey.normal,
    stroke: grey.dark,
    opacity: 0.8,
    fillOpacity: 0.2,
    strokeOpacity: 0.5,
    shadowBlur: 2,
  },
  status: {
    inactive: {
      keyshape: {
        opacity: 0.2,
      },
    },
    active: {
      keyshape: {
        opacity: 0.3,
      },
    },
    selected: {
      keyshape: {
        opacity: 1.0,
      },
    },
  },
};

export type NodeStyleType = Partial<typeof DEFAULT_NODE_STYLE>;
export type NodeStyleKey = keyof typeof DEFAULT_NODE_STYLE;

export const EDGE_DEFAULT_PATTERN: EdgePattern = null;

export const edgeLineColor = normalizeColor(EDGE_DEFAULT_COLOR);
export const edgeFontColor = normalizeColor(EDGE_LABEL_DEFAULT_COLOR);
export const edgeLinePattern = mapEdgePattern(EDGE_DEFAULT_PATTERN);
export const DEFAULT_EDGE_STYLE = {
  color: EDGE_DEFAULT_COLOR,
  lineWidth: 1,
  opacity: 1,
  label: {
    fill: edgeFontColor.dark,
    fontSize: 12,
    offset: [0, 5],
  },
  keyshape: {
    stroke: edgeLineColor.dark,
    lineDash: edgeLinePattern,
    cursor: 'pointer',
    shadowColor: 'transparent',
    endArrow: {
      d: -1 / 2,
      path: `M 0,0 L 4,2 L 4,-2 Z`,
      fill: EDGE_DEFAULT_COLOR,
    },
  },
  status: {
    disabled: {
      label: {
        fill: edgeFontColor.reflect,
      },
    },
    active: {
      keyshape: {
        stroke: edgeLineColor.dark,
      },
    },
  },
};

export type EdgeStyleType = Partial<typeof DEFAULT_EDGE_STYLE>;
export type EdgeStyleKey = keyof typeof DEFAULT_EDGE_STYLE;
