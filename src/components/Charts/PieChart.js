import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import { toolbox as featuresEN } from 'echarts/lib/langEN';
import { useStyletron } from 'baseui';
import { useWindowDimension } from '@blocklynx/ui';

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
    dataZoom: { show: false }, // Nothing to zoom for pie
  },
};

const stackLegend = {
  type: 'plain',
  bottom: 30,
  left: 'center',
  right: '10%',
};

const scrollLegend = {
  type: 'scroll',
  bottom: 60,
  left: 'center',
};

const formatTooltip = params => {
  const { seriesName, name, percent } = params;
  const value = params.value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
  return `${seriesName} <br/>${name}: ${value} ETH (${percent}%)`;
};

const PieChart = ({ data, title }) => {
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
        tooltip: {
          trigger: 'item',
          formatter: formatTooltip,
        },
        toolbox: responsiveToolbox,
        legend: responsiveLegend,
        series: [
          {
            name: title,
            type: 'pie',
            center: ['50%', '40%'],
            radius: ['45%', '60%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold',
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data,
          },
        ],
      }}
      notMerge
      lazyUpdate
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default PieChart;
