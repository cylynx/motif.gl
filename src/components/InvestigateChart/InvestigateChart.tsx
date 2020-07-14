import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as Prop from '../../types/Prop';
import InvestigateChartLegend from './InvestigateChartLegend';
import InvestigateGraph from './InvestigateGraph';
import { getGraph } from '../../redux/accessors';

const InvestigateChart: React.FC<Prop.InvestigateChart> = ({ NodeMenu }) => {
  const graphFlatten = useSelector((state) => getGraph(state).graphFlatten);
  const [menu, setMenu] = useState(null);

  return (
    <>
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
    </>
  );
};

export default InvestigateChart;
