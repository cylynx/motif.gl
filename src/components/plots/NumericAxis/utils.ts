import { ScaleLinear } from 'd3-scale';
import {
  getDecimalPrecisionCount,
  preciseRound,
} from '../../../utils/data-utils';

export type DomainType = [number, number];
export interface TickRules {
  [key: string]: number;
}
export interface NumericTicks {
  tickValues: number[];
  type: string;
  decimalPrecision?: number;
}

/**
 * To prevent overlap in the x-axis, the number of axis is determined by:
 *  1. the number of decimal precisions found in the number
 *
 * @param {number} decimalPrecision - decimal precision of a number
 * @return {number} - number of ticks for the axis
 */
export const getTickCounts = (decimalPrecision: number): number => {
  const DEFAULT_TICK_COUNTS = 5;

  if (decimalPrecision < 2) {
    return DEFAULT_TICK_COUNTS;
  }

  if (decimalPrecision >= 2 && decimalPrecision <= 4) {
    return 4;
  }

  if (decimalPrecision >= 5 && decimalPrecision <= 6) {
    return 3;
  }

  // decimalPrecision >= 7
  return 2;
};

/**
 * Generate numeric ticks to handle the following data types:
 *  1. Integer with thousands, hundred thousands, millions and billions.
 *  2. Floats with maximum 8 precisions.
 *
 * The ticks are generated manually with the following reasons:
 *  1. d3-axis is not clever enough to determine whether ticks are overlapped
 *  2. format integer with large values to specific units (K, M, B)
 *  3. determine number of ticks based on decimal precisions to prevent overlapped
 *
 * @param {domainType} domain
 * @param {ScaleLinear<number,number>} scale
 */
export const generateNumericTicks = (
  domain: DomainType,
  scale: ScaleLinear<number, number>,
) => {
  const [minTick, maxTick] = domain;

  const minDecimalPrecision: number = getDecimalPrecisionCount(minTick);
  const maxDecimalPrecision: number = getDecimalPrecisionCount(maxTick);
  const decimalPrecision: number =
    -Math.min(minDecimalPrecision, maxDecimalPrecision) + 1;

  // either minTick or maxTick is float.
  if (decimalPrecision > 0) {
    const ticksCount: number = getTickCounts(decimalPrecision);
    const tickValues = scale
      .ticks(ticksCount)
      .map((tick: number) => parseFloat(preciseRound(tick, 8)));
    return { tickValues, type: 'float', decimalPrecision };
  }

  // both minTick and maxTick are integer
  const tickCounts = 5;
  const tickValues: number[] = scale.ticks(tickCounts);

  return { tickValues, type: 'integer', decimalPrecision: 0 } as NumericTicks;
};
