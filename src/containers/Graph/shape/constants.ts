import { EdgePattern } from './utils';

export const GREY = 'rgba(204,204,204,1)';
export const EDGE_DEFAULT_COLOR = 'rgba(105, 123, 140,1)';
export const EDGE_LABEL_DEFAULT_COLOR = 'rgba(59, 59, 59,1)';
export const HIDDEN_LABEL_COLOR = 'rgba(238, 238, 238,1)';
export const HIDDEN_LINE_COLOR = 'rgba(238, 238, 238,1)';
export const PRIMARY_NODE_COLOR = 'rgba(102, 194, 165, 1)';

export const DEFAULT_ICON_FONT_FAMILY = `-apple-system, system-ui, BlinkMacSystemFont, 
'Segoe UI', Roboto, 'Helvetica Neue', 
Ubuntu, Arial, sans-serif`;

export enum EnumNodeAndEdgeStatus {
  NORMAL = 'normal',
  SELECTED = 'selected',
  LIGHT = 'highlight.light',
  DARK = 'highlight.dark',
  HOVERED = 'hovered',
  FILTERED = 'filtered',
}

export const interactionStates = [
  EnumNodeAndEdgeStatus.NORMAL,
  EnumNodeAndEdgeStatus.SELECTED,
  EnumNodeAndEdgeStatus.LIGHT,
  EnumNodeAndEdgeStatus.DARK,
  EnumNodeAndEdgeStatus.HOVERED,
];

/* Additions */

export const DEFAULT_NODE_STYLE = {
  size: 20,
  color: PRIMARY_NODE_COLOR,
  fontFamily: DEFAULT_ICON_FONT_FAMILY,
  fontSize: 12,
};

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
};

export type EdgeStyleType = Partial<typeof DEFAULT_EDGE_STYLE>;
export type EdgeStyleKey = keyof typeof DEFAULT_EDGE_STYLE;
