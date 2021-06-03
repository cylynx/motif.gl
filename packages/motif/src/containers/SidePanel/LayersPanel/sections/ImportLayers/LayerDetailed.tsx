import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
import { styled } from 'baseui';
import {
  GroupEdgeReturns,
  groupEdgesForImportation,
} from '../../../../../redux/graph/processors/group-edges';
import { GraphData } from '../../../../../redux/graph';
import GraphStatistics from '../../components/GraphStatistics';
import GroupEdges from '../GroupEdges';

const StyledHr = styled('hr', ({ $theme }) => ({
  borderColor: $theme.colors.mono700,
  borderWidth: '1px',
  borderStyle: 'solid',
  marginTop: $theme.sizing.scale500,
}));

type LayerDetailProps = { graph: GraphData; index: number };
const LayerDetailed = ({ graph, index }: LayerDetailProps) => {
  const graphWithGroupEdge = useMemo(() => {
    const { groupEdges, visible } = graph.metadata;

    if (visible === false) {
      return graph;
    }

    const { graphData }: GroupEdgeReturns = groupEdgesForImportation(
      graph,
      groupEdges,
    );

    return graphData;
  }, [graph]);

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
          hiddenNodeLength={hiddenNodeLength}
          hiddenEdgeLength={hiddenEdgeLength}
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
