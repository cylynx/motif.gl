// @ts-nocheck
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slider } from 'baseui/slider';
import { Block } from 'baseui/block';
import { LabelLarge } from 'baseui/typography';
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
import * as Prop from '../../types/Prop';

import { setRange, timeRangeChange } from '../../redux/graph-slice';
import EventChart from './EventChart';
import { getGraph, getAccessors } from '../../redux';

const windowOptions = ['30d', '7d', '1d', '1h', '1m'];

const deriveAggPeriod = (timerange: number) => {
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

const groupByTime = (ts: number, windowOption: string) => {
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
  const timeRange = useSelector((state) => getGraph(state).timeRange);
  const sliderRange = useSelector((state) => getGraph(state).selectTimeRange);
  const tsData = useSelector((state) => getGraph(state).tsData);
  const accessors = useSelector((state) => getAccessors(state));
  const [css] = useStyletron();

  // Group transactions with similar time together
  const aggPeriod = deriveAggPeriod(timeRange[1] - timeRange[0]);

  const aggSeries = groupBy(tsData, (result) =>
    groupByTime(result[0], aggPeriod),
  );

  const dataSeries = [];
  Object.entries(aggSeries).forEach(([key, value]) =>
    dataSeries.push([new Date(key).getTime(), value.length]),
  );

  // Filter the bar graph to get the colour
  const colouredData = dataSeries.map((point) => {
    const itemStyle: Prop.ItemStyle = {};
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

  return (
    <Fragment>
      {tsData.length === 0 && (
        <LabelLarge marginLeft='24px' marginTop='24px'>
          No Time Series Data Available
        </LabelLarge>
      )}
      {tsData.length > 0 && (
        <Block>
          <div
            className={css({
              position: 'absolute',
              height: '135px',
              width: '500px',
            })}
          >
            <EventChart
              data={colouredData}
              min={timeRange[0]}
              max={timeRange[1]}
            />
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
              onFinalChange={({ value }) =>
                dispatch(timeRangeChange({ timeRange: value, accessors }))
              }
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
        </Block>
      )}
    </Fragment>
  );
};

export default InvestigateTimeBar;
