import { normalizeColor, EdgePattern } from './utils';

export const GREY = normalizeColor([204, 204, 204]);
export const EDGE_DEFAULT_COLOR = normalizeColor([105, 123, 140]);
export const EDGE_LABEL_DEFAULT_COLOR = normalizeColor([59, 59, 59]);
export const HIDDEN_LABEL_COLOR = normalizeColor([238, 238, 238]);
export const HIDDEN_LINE_COLOR = normalizeColor([238, 238, 238]);
export const PRIMARY_NODE_COLOR = normalizeColor([135, 59, 244]);

export const DEFAULT_ICON_FONT_FAMILY = `-apple-system, system-ui, BlinkMacSystemFont, 
'Segoe UI', Roboto, 'Helvetica Neue', 
Ubuntu, Arial, sans-serif`;

export enum EnumNodeAndEdgeStatus {
  NORMAL = 'normal',
  SELECTED = 'selected',
  LIGHT = 'highlight.light',
  DARK = 'highlight.dark',
  HOVERED = 'hovered',
}

/* Additions */

export const DEFAULT_NODE_STYLE = {
  size: 5,
  color: PRIMARY_NODE_COLOR,
  fontFamily: DEFAULT_ICON_FONT_FAMILY,
  fontSize: 12,
};

export type NodeStyle = keyof typeof DEFAULT_NODE_STYLE;

export const EDGE_DEFAULT_PATTERN: EdgePattern = null;

export const DEFAULT_EDGE_STYLE = {
  color: EDGE_DEFAULT_COLOR,
  width: 1,
  pattern: EDGE_DEFAULT_PATTERN,
  fontColor: EDGE_LABEL_DEFAULT_COLOR,
  fontFamily: DEFAULT_ICON_FONT_FAMILY,
  fontSize: 12,
};

export type EdgeStyle = keyof typeof DEFAULT_EDGE_STYLE;
