import { GREY, PRIMARY_COLOR } from './colors';
import { EdgePattern } from '../utils/shape-utils';
import { normalizeColor } from '../utils/style-utils';

export { GREY } from './colors';
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

/* Additions */

// export const DEFAULT_NODE_STYLE = {
//   size: 20,
//   color: PRIMARY_NODE_COLOR,
//   fontFamily: DEFAULT_ICON_FONT_FAMILY,
//   fontSize: 12,
// };

export type NodeStyleType = Partial<typeof DEFAULT_NODE_STYLE>;
export type NodeStyleKey = keyof typeof DEFAULT_NODE_STYLE;

export const EDGE_DEFAULT_PATTERN: EdgePattern = null;

export const DEFAULT_EDGE_STYLE = {
  color: EDGE_DEFAULT_COLOR,
  width: 1,
  pattern: EDGE_DEFAULT_PATTERN,
  fontColor: EDGE_LABEL_DEFAULT_COLOR,
  fontFamily: DEFAULT_ICON_FONT_FAMILY,
  fontSize: 12,
  endArrow: {
    d: -1 / 2,
    path: `M 0,0 L 4,2 L 4,-2 Z`,
    fill: EDGE_DEFAULT_COLOR,
  },
};

export type EdgeStyleType = Partial<typeof DEFAULT_EDGE_STYLE>;
export type EdgeStyleKey = keyof typeof DEFAULT_EDGE_STYLE;

const grey = normalizeColor(GREY);
const nodeColor = normalizeColor(PRIMARY_NODE_COLOR);
export const DEFAULT_NODE_STYLE = {
  color: nodeColor,
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
