import React, { Fragment } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { LabelSmall, ParagraphSmall } from 'baseui/typography';
import DndList from '../../../components/DndList';
import {
  updateGraphList,
  deleteGraphList,
  changeVisibilityGraphList,
} from '../../../redux/graph/slice';
import { openDataTableModal } from '../../../redux/ui/slice';
import { Statistic } from '../../../components/ui';
import {
  GraphSelectors,
  GraphUtils,
  GraphData,
  Node,
  Edge,
} from '../../../redux/graph';
import useNodeStyle from '../../../redux/graph/hooks/useNodeStyle';
import useSearchOption from '../SearchPanel/hooks/useSearchOption';

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

const LayerDetailed = ({
  graph,
  index,
}: {
  graph: GraphData;
  index: number;
}) => {
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

const ImportLayers = () => {
  const dispatch = useDispatch();
  const { switchToFixNodeColor } = useNodeStyle();
  const { resetSearchOptions } = useSearchOption();
  const graphList = useSelector((state) => GraphSelectors.getGraphList(state));

  const importItems = graphList.map((graph: GraphData, index: number) => {
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
    resetSearchOptions();
    switchToFixNodeColor();
  };

  const onChangeVisibility = (index: number, isVisible: boolean) => {
    dispatch(changeVisibilityGraphList({ index, isVisible }));
  };

  return (
    <Block overflow='auto'>
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
