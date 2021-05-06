import { ScaleTime } from 'd3-scale';

/**
 * Convert the given timestamp to H:m:s format.
 *
 * @param {any} timestamp
 * @return {string}
 */
export const convertToHms = (timestamp: any): string => {
  const date: Date = new Date(timestamp);
  const time: string = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  return time;
};

/**
 * Generate time ticks with the given ranges.
 *
 * @param {ScaleTime<number, number>} scale
 * @return {Date[]}
 */
export const generateTimeTicks = (scale: ScaleTime<number, number>): Date[] => {
  const tickCounts = 4;
  const ticksValues: Date[] = scale.ticks(tickCounts);

  return ticksValues;
};
