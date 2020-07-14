import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/lib/echarts';
import * as Prop from '../../types/Prop';
import * as Graph from '../../types/Graph';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';

import { CATEGORIES_COLOR } from '../../utils/categories';

const deriveLegendCategories = (data: Graph.Data) => {
  const nodes = [...data.nodes];
  const newNodes = nodes.filter((obj, pos, arr) => (
      arr.map((mapObj) => mapObj.data.category).indexOf(obj.data.category) === pos
    ));
  const legend = [];
  for (const node of newNodes) {
    const n: any = {};
    n.name = node.data.category;
    n.type = 'scatter';
    n.color = CATEGORIES_COLOR[node.data.category];
    legend.push(n);
  }
  return legend;
};

const InvestigateChartLegend: React.FC<Prop.InvestigateChartLegend> = ({
  data,
}) => {
  const legendCategories = deriveLegendCategories(data);
  return (
    <ReactEchartsCore
      echarts={echarts}
      option={{
        legend: {
          type: 'scroll',
          orient: 'vertical',
          align: 'right',
          right: 0,
          top: 0,
          selectedMode: false,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          show: false,
        },
        series: legendCategories,
      }}
      notMerge
      lazyUpdate
      style={{ height: '150px', width: '200px' }}
    />
  );
};

export default InvestigateChartLegend;
