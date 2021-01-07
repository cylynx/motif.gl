import { ScaleTime } from 'd3-scale';
import {
  format,
  differenceInCalendarYears,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';

/**
 * Generate date time ticks randomly dedicated for DateTime and Date data types.
 *
 * @param {ScaleTime<number,number>} scale
 * @return {Date[]} tickValues
 */
export const generateDateTimeTicks = (
  scale: ScaleTime<number, number>,
): Date[] => {
  const tickCounts: number = 3;
  const ticksValues: Date[] = scale.ticks(tickCounts);

  return ticksValues;
};

export const dateTimeMultiFormat = (date: Date, dateFormat: string): string => {
  const formatttedDate: string = format(date, dateFormat);

  return formatttedDate;
};

/**
 * determine the format of date time based on intervals
 * 1. seconds - format in (:200ms)
 * 2. minutes - format in (:50s)
 * 3. hours - format in (12:20 PM)
 * 4. days - format in (12:20 PM)
 * 5. weeks - format in (14/12/20)
 * 6. months - format in (12/20)
 * 7. years - format in (2020)
 * 8. only date - format in (14/12/20 12:20:50 PM)
 *
 * @param {Date[]} dateArr
 * @return {string}
 */
export const dateTimeFormatDeterminer = (dateArr: any): string => {
  if (dateArr.length === 1) {
    return 'dd/MM/yy hh:mm:ss a';
  }

  const [firstDate] = dateArr;
  const secondDate = dateArr[dateArr.length - 1];
  const yearDiff = differenceInCalendarYears(secondDate, firstDate);
  if (yearDiff >= 1) {
    return 'Y';
  }

  const monthDiff = differenceInCalendarMonths(secondDate, firstDate);
  if (monthDiff >= 1) {
    return 'MM/yy';
  }

  const weekDiff = differenceInCalendarWeeks(secondDate, firstDate);
  if (weekDiff >= 1) {
    return 'dd/MM/yy';
  }

  const dayDiff = differenceInCalendarDays(secondDate, firstDate);
  if (dayDiff >= 1) {
    return 'dd/MM';
  }

  const hoursDiff = differenceInHours(secondDate, firstDate);
  if (hoursDiff) {
    return 'HH:mm';
  }

  const minsDiff = differenceInMinutes(secondDate, firstDate);
  if (minsDiff) {
    return 'HH:mm';
  }

  const secDiff = differenceInSeconds(secondDate, firstDate);
  if (secDiff) {
    return ":ss's'";
  }

  // difference in milliseconds
  return ":SSS'ms'";
};
