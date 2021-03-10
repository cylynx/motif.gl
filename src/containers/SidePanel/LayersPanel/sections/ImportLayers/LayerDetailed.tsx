import { useSelector } from 'react-redux';
import React from 'react';
import { Block } from 'baseui/block';
import { styled } from 'baseui';
import {
  Edge,
  GraphData,
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
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );
  const visibleNodeList = graphVisible.nodes.map((x: Node) => x.id);
  const visibleEdgeList = graphVisible.edges.map((x: Edge) => x.id);
  const hiddenNodes = graph.nodes.filter(
    (x) => !visibleNodeList.includes(x.id),
  );
  const hiddenEdges = graph.edges.filter(
    (x) => !visibleEdgeList.includes(x.id),
  );

  return (
    <>
      <Block
        display='flex'
        justifyContent='space-between'
        paddingLeft='scale300'
        paddingRight='scale300'
      >
        <GraphStatistics
          nodeLength={graph.nodes.length}
          edgeLength={graph.edges.length}
          hiddenNodeLength={hiddenNodes.length}
          hiddenEdgeLength={hiddenEdges.length}
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
