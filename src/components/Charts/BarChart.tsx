// @ts-nocheck
import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/lib/echarts';
import '../../../node_modules/echarts/lib/chart/bar';
import '../../../node_modules/echarts/lib/component/legend';
import '../../../node_modules/echarts/lib/component/legendScroll';
import '../../../node_modules/echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import { toolbox as featuresEN } from 'echarts/lib/langEN';
import { useStyletron } from 'baseui';
import { useWindowDimension } from '../ui';
import * as Prop from '../../types/Prop';

const toolbox = {
  show: true,
  right: 60,
  feature: {
    ...featuresEN,
    dataView: {
      ...featuresEN.dataView,
      readOnly: true,
    },
    restore: { show: false },
  },
};

const stackLegend = {
  type: 'plain',
  top: 40,
  right: 60,
};

const scrollLegend = {
  type: 'scroll',
  top: 20,
  right: 60,
};

const BarChart: React.FC<Prop.YAxisChart> = ({ data, title, yLabel }) => {
  const [, theme] = useStyletron();
  const { width } = useWindowDimension();
  const responsiveLegend =
    width > theme.breakpoints.medium ? stackLegend : scrollLegend;
  const responsiveToolbox =
    width > theme.breakpoints.medium ? toolbox : { show: false };
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
        grid: {
          top: 80,
          bottom: 60,
          left: 60,
          right: 60,
        },
        tooltip: {
          trigger: 'axis',
        },
        toolbox: responsiveToolbox,
        legend: responsiveLegend,
        xAxis: {
          type: 'category',
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          name: yLabel,
          left: 0,
          right: 0,
          type: 'value',
          boundaryGap: [0, '20%'],
        },
        series: data,
      }}
      notMerge
      lazyUpdate
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default BarChart;
