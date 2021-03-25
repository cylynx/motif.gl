import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
import { styled } from 'baseui';
import {
  Edge,
  GraphData,
  GraphList,
  GraphSelectors,
  Node,
} from '../../../../../redux/graph';
import GraphStatistics from '../../components/GraphStatistics';
import GroupEdges from '../GroupEdges';
import useGroupEdges from '../../hooks/useGroupEdges';

const StyledHr = styled('hr', ({ $theme }) => ({
  borderColor: $theme.colors.mono700,
  borderWidth: '1px',
  borderStyle: 'solid',
  marginTop: $theme.sizing.scale500,
}));

type LayerDetailProps = { graph: GraphData; index: number };
const LayerDetailed = ({ graph, index }: LayerDetailProps) => {
  const { groupEdges } = useGroupEdges(index);

  const graphWithGroupEdge = useSelector((state) =>
    GraphSelectors.getAggregatedGroupGraphList(state, index, groupEdges),
  );

  // compute the information for statistics
  const visibleNodeLength = graphWithGroupEdge.nodes.length;
  const visibleEdgeLength = graphWithGroupEdge.edges.length;
  const hiddenNodeLength = graph.nodes.length - visibleNodeLength;
  const hiddenEdgeLength = graph.edges.length - visibleEdgeLength;

  return (
    <>
      <Block
        display='flex'
        justifyContent='space-between'
        paddingLeft='scale300'
        paddingRight='scale300'
      >
        <GraphStatistics
          nodeLength={visibleNodeLength}
          edgeLength={visibleEdgeLength}
          hiddenNodeLength={hiddenNodeLength < 0 ? 0 : hiddenNodeLength}
          hiddenEdgeLength={hiddenEdgeLength < 0 ? 0 : hiddenEdgeLength}
          size='medium'
        />
      </Block>

      <StyledHr />

      <Block marginTop='scale300'>
        <GroupEdges graphListIndex={index} />
      </Block>
    </>
  );
};

export default LayerDetailed;
