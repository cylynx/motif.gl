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

const StyledHr = styled('hr', ({ $theme }) => ({
  borderColor: $theme.colors.mono700,
  borderWidth: '1px',
  borderStyle: 'solid',
  marginTop: $theme.sizing.scale500,
}));

type LayerDetailProps = { graph: GraphData; index: number };
const LayerDetailed = ({ graph, index }: LayerDetailProps) => {
  const graphFlatten = useSelector((state) =>
    GraphSelectors.getGraphFlatten(state),
  );

  const graphNodeIds: string[] = graph.nodes.map((x: Node) => x.id);
  const graphEdgeIds: string[] = graph.edges.map((x: Edge) => x.id);

  // obtain the group edges that belongs to this dataframe
  const currentGroupEdges = useMemo(() => {
    return graphFlatten.edges
      .filter((e: Edge) => e.id.includes('group'))
      .filter(
        (e: Edge) =>
          graphNodeIds.includes(e.source) && graphNodeIds.includes(e.target),
      );
  }, [graphFlatten.edges, graphNodeIds]);

  // obtain the nodes that belongs to this dataframe
  const currentGraphNodes = useMemo(() => {
    return graphFlatten.nodes.filter((node: Node) =>
      graphNodeIds.includes(node.id),
    );
  }, [graphFlatten.nodes]);

  // obtain the edges that belongs to this dataframe
  const currentGraphEdges = useMemo(() => {
    return graphFlatten.edges.filter((edge: Edge) =>
      graphEdgeIds.includes(edge.id),
    );
  }, [graphFlatten.edges]);

  // compute the information for statistics
  const visibleNodeLength = currentGraphNodes.length;
  const visibleEdgeLength = currentGraphEdges.length + currentGroupEdges.length;
  const hiddenNodeLength = graphNodeIds.length - currentGraphNodes.length;
  const hiddenEdgeLength = graphEdgeIds.length - visibleEdgeLength;

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
