import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slider } from 'baseui/slider';
import inRange from 'lodash/inRange';
import groupBy from 'lodash/groupBy';
import {
  startOfMinute,
  startOfHour,
  startOfDay,
  startOfWeek,
  startOfMonth,
} from 'date-fns';

import { useStyletron } from 'baseui';

import { setRange, timeRangeChange } from '../redux/graphSlice';
import EventChart from './EventChart';

const windowOptions = ['30d', '7d', '1d', '1h', '1m'];

const deriveAggPeriod = timerange => {
  // If interval is a year used a month to break the bars down
  // Always use one smaller than the interval
  if (Math.floor(timerange / (1000 * 60 * 60 * 24 * 30 * 12)) > 0) {
    return windowOptions[0];
  }
  if (Math.floor(timerange / (1000 * 60 * 60 * 24 * 30)) > 0) {
    return windowOptions[1];
  }
  if (Math.floor(timerange / (1000 * 60 * 60 * 24 * 7)) > 0) {
    return windowOptions[2];
  }
  if (Math.floor(timerange / (1000 * 60 * 60 * 24)) > 0) {
    return windowOptions[3];
  }
  return windowOptions[4];
};

const groupByTime = (ts, windowOption) => {
  if (windowOption === '1m') {
    return startOfMinute(ts);
  }
  if (windowOption === '1h') {
    return startOfHour(ts);
  }
  if (windowOption === '1d') {
    return startOfDay(ts);
  }
  if (windowOption === '7d') {
    return startOfWeek(ts);
  }
  return startOfMonth(ts);
};

const InvestigateTimeBar = () => {
  const dispatch = useDispatch();
  const timeRange = useSelector(state => state.graph.present.timeRange);
  const sliderRange = useSelector(state => state.graph.present.selectTimeRange);
  const tsData = useSelector(state => state.graph.present.tsData);
  const [css] = useStyletron();

  // Group transactions with similar time together
  const aggPeriod = deriveAggPeriod(timeRange[1] - timeRange[0]);

  const aggSeries = groupBy(tsData, result =>
    groupByTime(result[0], aggPeriod)
  );

  const dataSeries = [];
  Object.entries(aggSeries).forEach(([key, value]) =>
    dataSeries.push([new Date(key).getTime(), value.length])
  );

  // Filter the bar graph to get the colour
  const colouredData = dataSeries.map(point => {
    const itemStyle = {};
    if (inRange(point[0], sliderRange[0], sliderRange[1])) {
      itemStyle.color = '#FE6B73';
    } else {
      itemStyle.color = '#FBB3B7';
    }
    return {
      value: point,
      itemStyle,
    };
  });

  // Time bar functions
  // const onTimeRangeChange = selectedTimeRange => dispatch(timeRangeChange(selectedTimeRange));
  // const onTimeRangeChangeDebounce = throttle(onTimeRangeChange, 500);

  return (
    <>
      <div
        className={css({
          position: 'absolute',
          height: '135px',
          width: '500px',
        })}
      >
        <EventChart data={colouredData} min={timeRange[0]} max={timeRange[1]} />
      </div>
      <div
        className={css({
          marginTop: '77px',
          marginLeft: '20px',
          marginRight: '20px',
        })}
      >
        <Slider
          min={timeRange[0]}
          max={timeRange[1]}
          step={0.1}
          value={sliderRange}
          onChange={({ value }) => dispatch(setRange(value))}
          onFinalChange={({ value }) => dispatch(timeRangeChange(value))}
          overrides={{
            ThumbValue: () => null,
            Tick: () => null,
            Thumb: {
              style: {
                height: '20px',
              },
            },
          }}
        />
      </div>
    </>
  );
};

export default InvestigateTimeBar;
