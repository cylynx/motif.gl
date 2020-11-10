import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Cell } from 'baseui/layout-grid';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { LabelSmall, ParagraphSmall } from 'baseui/typography';
import {
  updateGraphList,
  deleteGraphList,
  changeVisibilityGraphList,
} from '../../redux/graph-slice';
import { openDataTableModal } from '../../redux/ui-slice';
import { Statistic, FlushedGrid } from '../../components/ui';
import DndList from '../../components/DndList';
import { countProperty } from '../../utils/graph-utils';
import * as Graph from '../../types/Graph';
import { getGraph } from '../../redux';

const StyledText = ({ children }: { children: React.ReactNode }) => (
  <ParagraphSmall
    marginLeft='scale200'
    marginBottom={0}
    marginTop='scale200'
    color='contentSecondary'
  >
    {children}
  </ParagraphSmall>
);

const LayerDetailed = ({
  graph,
  index,
}: {
  graph: Graph.GraphData;
  index: number;
}) => {
  const dispatch = useDispatch();
  const graphVisible = useSelector((state) => getGraph(state).graphVisible);
  const accessors = useSelector((state) => getGraph(state).accessors);
  const visibleNodeList = graphVisible.nodes.map((x) => x.id);
  const visibleEdgeList = graphVisible.edges.map((x) => x.id);
  const hiddenNodes = graph.nodes.filter(
    (x) => !visibleNodeList.includes(x.id),
  );
  const hiddenEdges = graph.edges.filter(
    (x) => !visibleEdgeList.includes(x.id),
  );
  const nodeTypeMap = accessors.nodeType
    ? countProperty(graph.nodes, accessors.nodeType)
    : null;
  const edgeTypeMap = accessors.edgeType
    ? countProperty(graph.edges, accessors.edgeType)
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
          {!nodeTypeMap && <StyledText>No node types...</StyledText>}
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
          {!edgeTypeMap && <StyledText>No edge types...</StyledText>}
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
      <br />
    </Fragment>
  );
};

const ImportLayers = () => {
  const dispatch = useDispatch();
  const graphList = useSelector((state) => getGraph(state).graphList);

  const importItems = graphList.map((graph: Graph.GraphData, index: number) => {
    let title = `import ${index}`;
    if (graph.metadata?.title) {
      title = graph.metadata.title;
    }
    return {
      key: index,
      title,
      isVisible:
        typeof graph.metadata?.visible === 'undefined'
          ? true
          : graph.metadata?.visible,
      children: <LayerDetailed graph={graph} index={index} />,
    };
  });

  const onChangeOrder = (oldIndex: number, newIndex: number) => {
    dispatch(updateGraphList({ from: oldIndex, to: newIndex }));
  };

  const onDelete = (index: number) => {
    dispatch(deleteGraphList(index));
  };

  const onChangeVisibility = (index: number, isVisible: boolean) => {
    dispatch(changeVisibilityGraphList({ index, isVisible }));
  };

  return (
    <Block overflow='auto' maxHeight='calc(100vh - 200px - 150px)'>
      <DndList
        items={importItems}
        onChangeOrder={onChangeOrder}
        onChangeVisibility={onChangeVisibility}
        onDelete={onDelete}
      />
    </Block>
  );
};

export default ImportLayers;
