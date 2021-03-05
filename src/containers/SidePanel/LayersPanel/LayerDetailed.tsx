import { useDispatch, useSelector } from 'react-redux';
import React, { Fragment } from 'react';
import { Block } from 'baseui/block';
import { LabelSmall, ParagraphSmall } from 'baseui/typography';
import { Button } from 'baseui/button';
import { Statistic } from '../../../components/ui';
import {
  Edge,
  GraphData,
  GraphSelectors,
  GraphUtils,
  Node,
} from '../../../redux/graph';
import { openDataTableModal } from '../../../redux/ui/slice';

const StyledText = ({ children }: { children: React.ReactNode }) => (
  <ParagraphSmall
    marginLeft='scale200'
    marginBottom={0}
    marginTop='scale200'
    color='contentSecondary'
    overrides={{
      Block: {
        style: {
          textTransform: 'capitalize',
        },
      },
    }}
  >
    {children}
  </ParagraphSmall>
);

type LayerDetailProps = { graph: GraphData; index: number };
const LayerDetailed = ({ graph, index }: LayerDetailProps) => {
  const dispatch = useDispatch();
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );
  const accessors = useSelector((state) => GraphSelectors.getAccessors(state));
  const visibleNodeList = graphVisible.nodes.map((x: Node) => x.id);
  const visibleEdgeList = graphVisible.edges.map((x: Edge) => x.id);
  const hiddenNodes = graph.nodes.filter(
    (x) => !visibleNodeList.includes(x.id),
  );
  const hiddenEdges = graph.edges.filter(
    (x) => !visibleEdgeList.includes(x.id),
  );
  const nodeTypeMap = accessors.nodeType
    ? GraphUtils.countProperty(graph.nodes, accessors.nodeType)
    : null;
  const edgeTypeMap = accessors.edgeType
    ? GraphUtils.countProperty(graph.edges, accessors.edgeType)
    : null;

  return (
    <Fragment>
      <Block display='flex' justifyContent='space-between'>
        <Block>
          <Statistic
            value={graph.nodes.length}
            label='Nodes:'
            subtitle={`${hiddenNodes.length} hidden`}
            size='medium'
          />
          <LabelSmall marginTop='scale600'>Types:</LabelSmall>
          {nodeTypeMap &&
            Object.entries(nodeTypeMap).map(([key, value]) => (
              <StyledText key={key}>{`${value} x ${key}`}</StyledText>
            ))}
          {!nodeTypeMap && <StyledText>No Node Types.</StyledText>}
          <Block marginTop='scale600' />
          <Button
            kind='primary'
            size='mini'
            onClick={() =>
              dispatch(openDataTableModal(`table_graphList_${index}_nodes`))
            }
          >
            View Node Data
          </Button>
        </Block>
        <Block>
          <Statistic
            value={graph.edges.length}
            label='Edges:'
            subtitle={`${hiddenEdges.length} hidden`}
            size='medium'
          />
          <LabelSmall marginTop='scale600'>Types:</LabelSmall>
          {edgeTypeMap &&
            Object.entries(edgeTypeMap).map(([key, value]) => (
              <StyledText key={key}>{`${value} x ${key}`}</StyledText>
            ))}
          {!edgeTypeMap && <StyledText>No Edge Types.</StyledText>}
          <Block marginTop='scale600' />
          <Button
            kind='primary'
            size='mini'
            onClick={() =>
              dispatch(openDataTableModal(`table_graphList_${index}_edges`))
            }
          >
            View Edge Data
          </Button>
        </Block>
      </Block>
    </Fragment>
  );
};

export default LayerDetailed;
