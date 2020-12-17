import { ScaleLinear } from 'd3-scale';
import {
  getDecimalPrecisionCount,
  preciseRound,
} from '../../../utils/data-utils';

export type DomainType = [number, number];
export interface TickRules {
  [key: string]: number;
}
export interface INumericTicks {
  tickValues: number[];
  type: string;
  decimalPrecision?: number;
}

export const getTickCounts = (decimalPrecision: number) => {
  const DEFAULT_TICK_COUNTS = 6;
  const tickRules: TickRules = {
    '3': 5,
    '4': 5,
    '5': 4,
    '6': 4,
    '7': 3,
    '8': 3,
  };

  return tickRules[decimalPrecision.toString()] || DEFAULT_TICK_COUNTS;
};

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

  return { tickValues, type: 'integer', decimalPrecision: 0 } as INumericTicks;
};
