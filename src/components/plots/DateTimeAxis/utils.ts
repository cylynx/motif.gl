import { timeFormat } from 'd3-time-format';
import { ScaleTime } from 'd3-scale';
import {
  timeSecond,
  timeMinute,
  timeHour,
  timeMonth,
  timeDay,
  timeWeek,
  timeYear,
} from 'd3-time';

/**
 * format date time in x-axis based on intervals' difference
 * 1. seconds - format in (:200ms)
 * 2. minutes - format in (:50s)
 * 3. hours - format in (12:20 PM)
 * 4. days - format in (12:20 PM)
 * 5. weeks - format in (14/12/20)
 * 6. months - format in (12/20)
 * 7. years - format in (2020)
 *
 * @param {any} date
 * @return {timeFormat(specifier:string) => string}
 */
export const dateTimeMultiFormat = (date: any) => {
  const formatMillisecond = timeFormat(':%Lms');
    const formatSecond = timeFormat(':%Ss');
    const formatMinute = timeFormat('%I:%M %p');
    const formatHour = timeFormat('%I:%M %p');
    const formatDay = timeFormat('%d/%m/%y');
    const formatWeek = timeFormat('%d/%m/%y');
    const formatMonth = timeFormat('%m/%y');
    const formatYear = timeFormat('%Y');

  if (timeSecond(date) < date) {
    return formatMillisecond(date);
  }

  if (timeMinute(date) < date) {
    return formatSecond(date);
  }

  if (timeHour(date) < date) {
    return formatMinute(date);
  }

  if (timeDay(date) < date) {
    return formatHour(date);
  }

  if (timeMonth(date) < date) {
    // interval within a week
    if (timeWeek(date) < date) {
      return formatDay(date);
    }

    // interval more than a week
    return formatWeek(date);
  }

  if (timeYear(date) < date) {
    return formatMonth(date);
  }

  return formatYear(date);
};

export const generateDateTimeTicks = (scale: ScaleTime<number, number>) => {
  const tickCounts = 4;
  const ticksValues = scale.ticks(tickCounts);

  return ticksValues;
};
