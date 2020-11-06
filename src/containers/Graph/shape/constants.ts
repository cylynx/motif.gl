import { normalizeColor } from './utils';

export const GREY = normalizeColor([204, 204, 204]);
export const EDGE_LINE_DEFAULT_COLOR = normalizeColor([105, 123, 140]);
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
  size: 10,
  color: PRIMARY_NODE_COLOR,
  fontFamily: DEFAULT_ICON_FONT_FAMILY,
};

export type NodeStyle = keyof typeof DEFAULT_NODE_STYLE;
