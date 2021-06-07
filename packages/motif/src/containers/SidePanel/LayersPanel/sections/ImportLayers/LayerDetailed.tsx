import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
import { styled } from 'baseui';
import { LabelSmall } from 'baseui/typography';
import {
  GroupEdgeReturns,
  groupEdgesForImportation,
} from '../../../../../redux/graph/processors/group-edges';
import { GraphData } from '../../../../../redux/graph';
import GroupEdges from '../GroupEdges';

type LayerDetailProps = { graph: GraphData; index: number };
const LayerDetailed = ({ graph, index }: LayerDetailProps) => {
  const { groupEdges, visible } = graph.metadata;
  const graphWithGroupEdge = useMemo(() => {
    if (visible === false) {
      return graph;
    }

    const { graphData }: GroupEdgeReturns = groupEdgesForImportation(
      graph,
      groupEdges,
    );

    return graphData;
  }, [groupEdges, visible]);

  // compute the information for statistics
  const visibleNodeLength =
    visible === false ? 0 : graphWithGroupEdge.nodes.length;
  const visibleEdgeLength =
    visible === false ? 0 : graphWithGroupEdge.edges.length;
  const hiddenNodeLength =
    visible === false
      ? graphWithGroupEdge.nodes.length
      : graph.nodes.length - visibleNodeLength;
  const hiddenEdgeLength =
    visible === false
      ? graphWithGroupEdge.edges.length
      : graph.edges.length - visibleEdgeLength;

  return (
    <>
      <Block
        display='flex'
        justifyContent='space-between'
        paddingLeft='scale300'
        paddingRight='scale300'
      >
        <Block display='flex'>
          <LabelSmall marginRight='scale200' color='contentInverseSecondary'>
            Nodes:
          </LabelSmall>
          <LabelSmall>
            {visibleNodeLength}/{hiddenNodeLength + visibleNodeLength}{' '}
          </LabelSmall>
        </Block>
        <Block display='flex'>
          <LabelSmall marginRight='scale200' color='contentInverseSecondary'>
            Edges:
          </LabelSmall>
          <LabelSmall>
            {visibleEdgeLength}/{hiddenEdgeLength + visibleEdgeLength}{' '}
          </LabelSmall>
        </Block>
      </Block>

      <Block marginTop='scale300'>
        <GroupEdges graphListIndex={index} />
      </Block>
    </>
  );
};

export default LayerDetailed;
