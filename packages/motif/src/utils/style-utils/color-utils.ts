import get from 'lodash/get';
import { desaturate, lighten, transparentize } from 'polished';
import isUndefined from 'lodash/isUndefined';
import { CATEGORICAL_COLOR, DARK_GREY } from '../../constants/colors';
import { Node, NodeColor, Edge, EdgeColor } from '../../redux/graph/types';
export interface NormalizedColor {
  dark: string;
  normal: string;
  reflect: string;
}

/**
 * Normalized color with given colours code in HEX and RGB
 *
 * @param rgb
 * @return {NormalizedColor}
 */
export const normalizeColor = (
  rgb: string | number[] | NormalizedColor,
): NormalizedColor => {
  if (Array.isArray(rgb)) {
    const color = `rgba(${rgb.join(',')}, 1)`;
    return {
      dark: desaturate(0.1, lighten(0.1, color)),
      normal: color,
      reflect: transparentize(0.9, color),
    };
  }
  if (typeof rgb === 'string') {
    return {
      dark: desaturate(0.1, lighten(0.1, rgb)),
      normal: rgb,
      reflect: transparentize(0.9, rgb),
    };
  }
  return rgb as NormalizedColor;
};

/**
 * Generate default nodes / edges color map. 
 * defaultColor will be used for undefined variables
 *
 * @param {Node[]} nodes
 * @param {NodeColor} options
 *
 * @return {void}
 */
export const generateDefaultColorMap = (
  list: Node[] | Edge[],
  options: NodeColor | EdgeColor,
  defaultColor = DARK_GREY,
): void => {
  const uniqueKeys = [
    ...new Set(
      // @ts-ignore
      list.map((obj) => get(obj, options.variable)),
    ),
  ];
  const mapping = {};
  const MAX_LEGEND_SIZE = CATEGORICAL_COLOR.length;
  for (const [i, value] of uniqueKeys.entries()) {
    // Assign undefined to grey and all others to last of colors
    if (i < MAX_LEGEND_SIZE && !isUndefined(value)) {
      // @ts-ignore
      mapping[value] = CATEGORICAL_COLOR[i];
    } else if (isUndefined(value)) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      mapping['undefined'] = defaultColor;
    } else {
      // eslint-disable-next-line prefer-destructuring
      // @ts-ignore
      mapping[value] = CATEGORICAL_COLOR[MAX_LEGEND_SIZE - 1];
    }
  }
  // @ts-ignore
  options.mapping = mapping;
};
