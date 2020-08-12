import { ChartData } from '../types/Graph';

export const timeConverter = (timestamp: number): string => {
  // Unix timestamp in milliseconds
  const a = new Date(timestamp);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const year = a.getUTCFullYear();
  const month = months[a.getUTCMonth()];
  const date = a.getUTCDate();
  const hour = a.getUTCHours();
  const min =
    a.getUTCMinutes() < 10 ? `0${a.getUTCMinutes()}` : a.getUTCMinutes();
  const sec =
    a.getUTCSeconds() < 10 ? `0${a.getUTCSeconds()}` : a.getUTCSeconds();
  const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
  return time;
};

export const multiplyArr = (arr1: number[], arr2: number[]): number => {
  // Dot product of two arrays
  let result = 0;
  for (let i = 0; i < arr1.length; i += 1) {
    result += arr1[i] * arr2[i];
  }
  return result;
};

export const roundToTwo = (num: number): string => num.toFixed(2);

export const processScoreVector = (
  categories: { [key: string]: number | string },
  scoreVector: number[]
): ChartData[] => {
  const results = Object.keys(categories)
    .map((key, index) => ({
      name: key,
      value: parseFloat(roundToTwo(scoreVector[index] * 100)),
    }))
    .filter((item) => item.value > 0);
  return results;
};

export const json2Blob = (json: any): any =>
  new Blob([JSON.stringify(json)], {
    type: 'application/json',
  });

export const shortifyLabel = (label: string): string => {
  if (label.length <= 8) {
    return label;
  }
  return `${label.substring(0, 5)}...`;
};
