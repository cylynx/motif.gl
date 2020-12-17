import { bisectLeft, extent, histogram as d3Histogram, ticks } from 'd3-array';
import Decimal from 'decimal.js';
import { parseISO } from 'date-fns';

export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_YEAR = ONE_DAY * 365;

export type Millisecond = number;

export const StepMap = [
  { max: 0.001, step: 0.00005 },
  { max: 0.01, step: 0.0005 },
  { max: 0.1, step: 0.005 },
  { max: 1, step: 0.05 },
  { max: 10, step: 0.1 },
  { max: 100, step: 1 },
  { max: 500, step: 5 },
  { max: 1000, step: 10 },
  { max: 5000, step: 50 },
  { max: Number.POSITIVE_INFINITY, step: 1000 },
];

/**
 * whether null or undefined
 *
 * @param {any} input
 * @returns {boolean} boolean
 */
export const notNullorUndefined = (d: any): boolean => {
  return d !== undefined && d !== null;
};

/**
 * Get unique values of an array
 *
 * @param {any[]} values
 * @returns {any[]} unique values
 */
export const unique = (values: any[]): any[] => {
  const results: any[] = [];
  values.forEach((v) => {
    if (!results.includes(v) && notNullorUndefined(v)) {
      results.push(v);
    }
  });

  return results;
};

export type Accessor = {
  (data: any[]): any;
};

export type Sort = {
  (a: any, b: any): any;
};

/**
 * Return quantile domain for an array of data
 *
 * @param {any[]} data
 * @param {Accessor} valueAccessor function to access data
 * @param {Sort} sortFunc function to sort
 * @returns {number[]} domain of data
 */
export const getQuantileDomain = (
  data: any[],
  valueAccessor?: Accessor,
  sortFunc?: Sort,
): number[] => {
  const values =
    typeof valueAccessor === 'function' ? data.map(valueAccessor) : data;

  return values.filter(notNullorUndefined).sort(sortFunc);
};

/**
 * Return ordinal domain for an array of data i.e. unique values which are non null or undefined
 *
 * @param {any[]}  data
 * @param {Accessor} valueAccessor function to access data
 * @returns {string[]} domain of data
 */
export const getOrdinalDomain = (
  data: any[],
  valueAccessor?: Accessor,
): string[] => {
  const values =
    typeof valueAccessor === 'function' ? data.map(valueAccessor) : data;

  return unique(values).filter(notNullorUndefined).sort();
};

/**
 * Return linear domain for an array of data
 *
 * @param {any[]} data
 * @param {Accessor} [valueAccessor] function to access data
 * @returns {[number, number]} domain of data
 */
export const getLinearDomain = (
  data: any[],
  valueAccessor?: Accessor,
): [number, number] => {
  const range =
    typeof valueAccessor === 'function'
      ? extent(data, valueAccessor)
      : extent(data);
  // @ts-ignore
  return range.map((d, i) => (d === undefined ? i : d));
};

/**
 * Return linear domain for an array of data. A log scale domain cannot contain 0
 *
 * @param {any[]} data
 * @param {Accessor} [valueAccessor] function to access data
 * @returns {[number, number]} domain of data
 */
export const getLogDomain = (
  data: any[],
  valueAccessor?: Accessor,
): [number, number] => {
  const [d0, d1] = getLinearDomain(data, valueAccessor);

  return [d0 === 0 ? 1e-5 : d0, d1];
};

export type HistogramBin = {
  x0: number | undefined;
  x1: number | undefined;
  count: number;
};

export type TimeRangeFieldDomain = {
  domain: [number, number];
  step: number;
  histogram: HistogramBin[];
  enlargedHistogram: HistogramBin[];
  mappedValue: (Millisecond | null)[];
};

/**
 * Helper function to parse string date and convert to unix millisecond.
 * parsing is done using date-fns parseISO
 *
 * @param {string} str
 * @param {('DATETIME' | 'DATE' | 'TIME')} type
 * @return {*}
 */
export const unixTimeConverter = (
  str: string,
  type: 'DATETIME' | 'DATE' | 'TIME',
) => {
  if (type === 'DATETIME' || type === 'DATE') {
    return parseISO(str).getTime();
  }
  if (type === 'TIME') {
    return parseISO(
      `${new Date().toISOString().slice(0, 10)} ${str}`,
    ).getTime();
  }
  return null;
};

/**
 * Calculate timestamp domain and suitable step
 *
 * @param {any[]} data
 * @param {Accessor} [valueAccessor] function to access data
 * @param {string} type
 * @returns {TimeRangeFieldDomain} Object with domain, step, mappedValue, histogram and enlargedHistogram
 */
export const getFieldDomain = (
  data: any[],
  valueAccessor?: Accessor,
  type?: string,
): TimeRangeFieldDomain => {
  // to avoid converting string format time to epoch
  // every time we compare we store a value mapped to int in filter domain

  const accessedValues = data.map(valueAccessor);
  let mappedValue: any = [];
  if (Array.isArray(data) && Array.isArray(accessedValues[0])) {
    // Grouped edges
    for (const d of accessedValues) {
      mappedValue = mappedValue.concat(d.filter((el: any) => el != null));
    }
  } else if (Array.isArray(data)) {
    for (const d of accessedValues) {
      if (d != null) mappedValue.push(d);
    }
  }

  if (type === 'DATETIME' || type === 'DATE' || type === 'TIME') {
    mappedValue = mappedValue.map((dt: string) => unixTimeConverter(dt, type));
  }

  const domain = getLinearDomain(mappedValue);
  let step = 0.01;

  const diff = domain[1] - domain[0];
  const entry = StepMap.find((f) => f.max >= diff);
  if (entry) {
    step = entry.step;
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const { histogram, enlargedHistogram } = getHistogram(domain, mappedValue);
  return { domain, step, mappedValue, histogram, enlargedHistogram };
};

/**
 * Construct histogram bins based on given domain, values and bins
 *
 * @param {[number, number]} domain
 * @param {((Millisecond | null | number)[])} values
 * @param {number} [bins=30]
 * @returns {HistogramBin[]}
 */
export const histogramConstruct = (
  domain: [number, number],
  values: (Millisecond | null | number)[],
  bins = 30,
): HistogramBin[] => {
  return d3Histogram()
    .thresholds(ticks(domain[0], domain[1], bins))
    .domain(domain)(values)
    .map((bin) => ({
      count: bin.length,
      x0: bin.x0,
      x1: bin.x1,
    }));
};

/**
 * Calculate histogram from domain and array of values
 *
 * @param {[number, number]} domain
 * @param {((Millisecond | null | number)[])} values
 * @returns {{histogram: HistogramBin[]; enlargedHistogram: HistogramBin[]}}
 */
export const getHistogram = (
  domain: [number, number],
  values: (Millisecond | null | number)[],
): { histogram: HistogramBin[]; enlargedHistogram: HistogramBin[] } => {
  const histogram = histogramConstruct(domain, values, 30);
  const enlargedHistogram = histogramConstruct(domain, values, 100);

  return { histogram, enlargedHistogram };
};

/**
 * Returns a number whose value is limited to the given range
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {*}
 */
export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * round number with exact number of decimals
 * return as a string
 */
export function preciseRound(num: number, decimals: number) {
  const t = 10 ** decimals;
  return (
    Math.round(
      num * t +
        (decimals > 0 ? 1 : 0) * (Math.sign(num) * (10 / 100 ** decimals)),
    ) / t
  ).toFixed(decimals);
}

/**
 * get number of decimals to round to for slider from step
 * @param {number} step
 * @returns {number} - number of decimal
 */
export function getRoundingDecimalFromStep(step: number) {
  const splitZero = step.toString().split('.');
  if (splitZero.length === 1) {
    return 0;
  }
  return splitZero[1].length;
}

/**
 * Use in slider, given a number and an array of numbers, return the nears number from the array
 *
 * @param value
 * @param marks
 */
export function snapToMarks(value: number, marks: number[]) {
  // always use bin x0
  const i = bisectLeft(marks, value);
  if (i === 0) {
    return marks[i];
  }
  if (i === marks.length) {
    return marks[i - 1];
  }
  const idx = marks[i] - value < value - marks[i - 1] ? i : i - 1;
  return marks[idx];
}

/**
 * If marks is provided, snap to marks, if not normalize to step
 * @type {typeof import('./data-utils').normalizeSliderValue}
 * @param val
 * @param minValue
 * @param step
 * @param marks
 */
export function normalizeSliderValue(
  val: number,
  minValue: number,
  step: number,
  marks?: number[],
) {
  if (marks && marks.length) {
    return snapToMarks(val, marks);
  }

  return roundValToStep(minValue, step, val);
}

/**
 * round the value to step for the slider
 * @type {typeof import('./data-utils').roundValToStep}
 * @param minValue
 * @param step
 * @param val
 * @returns - rounded number
 */
export function roundValToStep(minValue: number, step: number, val: number) {
  if (!Number.isFinite(step) || !Number.isFinite(minValue)) {
    return val;
  }

  const decimal = getRoundingDecimalFromStep(step);
  const steps = Math.floor((val - minValue) / step);
  let remain = val - (steps * step + minValue);

  // has to round because javascript turns 0.1 into 0.9999999999999987
  remain = Number(preciseRound(remain, 8));

  let closest;
  if (remain === 0) {
    closest = val;
  } else if (remain < step / 2) {
    closest = steps * step + minValue;
  } else {
    closest = (steps + 1) * step + minValue;
  }

  // precise round return a string rounded to the defined decimal
  const rounded = preciseRound(closest, decimal);

  return Number(rounded);
}

export const getDecimalPrecisionCount = (float: number) => {
  const decimal = new Decimal(float);
  return decimal.e;
};
