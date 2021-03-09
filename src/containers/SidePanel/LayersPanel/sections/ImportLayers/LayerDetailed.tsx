import { useSelector } from 'react-redux';
import React from 'react';
import { Block } from 'baseui/block';
import {
  Edge,
  GraphData,
  GraphSelectors,
  Node,
} from '../../../../../redux/graph';
import GraphStatistics from '../../components/GraphStatistics';
import GroupEdges from '../GroupEdges';

type LayerDetailProps = { graph: GraphData };
const LayerDetailed = ({ graph }: LayerDetailProps) => {
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

      <Block marginTop='scale650'>
        <GroupEdges />
      </Block>
    </>
  );
};

export default LayerDetailed;
