import { ascending, extent, histogram as d3Histogram, ticks } from 'd3-array';

export type Millisecond = number;

export const TimestampStepMap = [
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
 * Calculate timestamp domain and suitable step
 *
 * @param {any[]} data
 * @param {Accessor} [valueAccessor] function to access data
 * @returns {TimeRangeFieldDomain} Object with domain, step, mappedValue, histogram and enlargedHistogram
 */
export const getTimestampFieldDomain = (
  data: any[],
  valueAccessor?: Accessor,
): TimeRangeFieldDomain => {
  // to avoid converting string format time to epoch
  // every time we compare we store a value mapped to int in filter domain

  const mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];
  const domain = getLinearDomain(mappedValue);
  let step = 0.01;

  const diff = domain[1] - domain[0];
  const entry = TimestampStepMap.find((f) => f.max >= diff);
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
