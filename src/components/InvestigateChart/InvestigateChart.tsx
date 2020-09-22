import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import * as Prop from '../../types/Prop';
import InvestigateChartLegend from './InvestigateChartLegend';
import InvestigateGraph from './InvestigateGraph';
import { getGraph } from '../../redux';

const InvestigateChart: React.FC<Prop.InvestigateChart> = ({ Tooltip }) => {
  const graphFlatten = useSelector((state) => getGraph(state).graphFlatten);
  const [tooltip, setTooltip] = useState(null);

  return (
    <Fragment>
      <InvestigateGraph setTooltip={setTooltip} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: '2%',
        }}
      >
        <InvestigateChartLegend data={graphFlatten} />
      </div>
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            width: '250px',
          }}
        >
          <Tooltip info={tooltip} />
        </div>
      )}
    </Fragment>
  );
};

export default InvestigateChart;
