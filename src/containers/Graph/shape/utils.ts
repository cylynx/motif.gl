/* https://github.com/antvis/Graphin/blob/master/packages/graphin/src/shape/graph-studio/utils.ts */
/* eslint-disable import/prefer-default-export */
import { ArrowOptions } from '../../../redux/graph/types';

export interface EndArrow {
  d: number;
  path: string;
}

export type EdgePattern = null | 'dot' | 'dash' | 'dash-dot' | 'none';

export const mapEdgePattern = (str: EdgePattern): number[] => {
  let result: null | number[] = null;
  // eslint-disable-next-line no-empty
  if (str === null) {
  } else if (str === 'dot') {
    result = [1, 1];
  } else if (str === 'dash') {
    result = [5, 5];
  } else if (str === 'dash-dot') {
    result = [4, 2, 1, 2];
  } else {
    // eslint-disable-next-line no-console
    console.warn(`Edge pattern ${str} not supported`);
  }
  return result;
};

/**
 * Process arrow options attributes with given data from `defaultStyle` in Edges.
 * - the end arrow will always be display on default unless user choose to hide
 *
 * @param {undefined|ArrowOptions} arrowOption
 * @return {string|ArrowOptions}
 */
export const processArrowOption = (
  arrowOption: undefined | ArrowOptions,
): string | ArrowOptions => {
  return arrowOption || 'display';
};

/**
 * Determine whether graph should display edge's arrow.
 *
 * @param {ArrowOptions|boolean} arrowOptions - obtain arrow configuration from option panels
 * @param {EndArrow} endArrow - end arrow styling
 */
export const isArrowDisplay = (
  arrowOptions: ArrowOptions | boolean | string,
  endArrow: EndArrow,
): boolean | EndArrow => {
  if (arrowOptions === 'none') {
    return false;
  }

  if (arrowOptions === true || arrowOptions === 'display') {
    return endArrow;
  }

  return endArrow;
};
