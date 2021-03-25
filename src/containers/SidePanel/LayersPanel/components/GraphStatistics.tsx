import React, { FC, useMemo } from 'react';
import { Statistic } from '../../../../components/ui';

type GraphStatisticsProps = {
  nodeLength: number;
  edgeLength: number;
  hiddenNodeLength: number;
  hiddenEdgeLength: number;
  size?: 'medium' | 'large';
};
const GraphStatistics: FC<GraphStatisticsProps> = ({
  nodeLength,
  edgeLength,
  hiddenNodeLength = 0,
  hiddenEdgeLength = 0,
  size = 'large',
}) => {
  return useMemo(
    () => (
      <>
        <Statistic
          value={nodeLength}
          label='Nodes:'
          subtitle={`${hiddenNodeLength < 0 ? 0 : hiddenNodeLength} hidden`}
          data-testid='nodes-count'
          size={size}
        />
        <Statistic
          value={edgeLength}
          label='Edges:'
          subtitle={`${hiddenEdgeLength < 0 ? 0 : hiddenEdgeLength} hidden`}
          data-testid='edges-count'
          size={size}
        />
      </>
    ),
    [nodeLength, edgeLength, hiddenNodeLength, hiddenEdgeLength],
  );
};

export default GraphStatistics;
