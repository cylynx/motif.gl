// @ts-nocheck
import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { useStyletron } from 'baseui';
import * as Prop from '../../types/Prop';

const RiskBarChart: React.FC<Prop.Chart> = ({ data, title }) => {
  const [, theme] = useStyletron();
  // Data comes in an array of {name, value} - needs to be transformed to echarts format
  const chartData = data.map((obj) => ({
    name: obj.name,
    type: 'bar',
    stack: 'group',
    label: {
      show: obj.value >= 5,
      color: '#E2E2E2',
    },
    data: [obj.value],
  }));

  const scrollLegend = {
    type: 'scroll',
    bottom: 10,
    textStyle: {
      color: theme.colors.contentPrimary,
    },
  };

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={{
        title: {
          text: title,
          show: false,
          top: 10,
          left: 10,
        },
        legend: scrollLegend,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        textStyle: {
          color: theme.colors.contentPrimary,
        },
        grid: {
          left: 10,
          right: 10,
          top: 0,
        },
        xAxis: {
          type: 'value',
          min: 0,
          max: 100,
        },
        yAxis: {
          type: 'category',
          data: ['Source of Funds'],
          show: false,
        },
        series: chartData,
      }}
      notMerge
      lazyUpdate
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default RiskBarChart;
