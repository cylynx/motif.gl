import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import * as Prop from '../../types/Prop';
import InvestigateChartLegend from './InvestigateChartLegend';
import InvestigateGraph from './InvestigateGraph';
import { getGraph } from '../../redux';

const InvestigateChart: React.FC<Prop.InvestigateChart> = ({ NodeMenu }) => {
  const graphFlatten = useSelector((state) => getGraph(state).graphFlatten);
  const [menu, setMenu] = useState(null);

  return (
    <Fragment>
      <InvestigateGraph setMenu={setMenu} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: '2%',
        }}
      >
        <InvestigateChartLegend data={graphFlatten} />
      </div>
      {menu && (
        <div
          style={{
            position: 'absolute',
            left: menu.x,
            top: menu.y,
            width: '250px',
          }}
        >
          <NodeMenu menu={menu} />
        </div>
      )}
    </Fragment>
  );
};

export default InvestigateChart;
