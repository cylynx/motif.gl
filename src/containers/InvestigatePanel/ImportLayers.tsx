import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Cell } from 'baseui/layout-grid';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import {
  updateGraphList,
  deleteGraphList,
  changeVisibilityGraphList,
} from '../../redux/graph-slice';
import { openDataTableModal } from '../../redux/ui-slice';
import { Statistic, FlushedGrid } from '../../components/ui';
import DndList from '../../components/DndList';
import * as Graph from '../../types/Graph';
import { getGraph } from '../../redux';

const LayerDetailed = ({
  graph,
  index,
}: {
  graph: Graph.GraphData;
  index: number;
}) => {
  const dispatch = useDispatch();
  const graphVisible = useSelector((state) => getGraph(state).graphVisible);
  const visibleNodeList = graphVisible.nodes.map((x) => x.id);
  const visibleEdgeList = graphVisible.edges.map((x) => x.id);
  const hiddenNodes = graph.nodes.filter(
    (x) => !visibleNodeList.includes(x.id),
  );
  const hiddenEdges = graph.edges.filter(
    (x) => !visibleEdgeList.includes(x.id),
  );

  return (
    <FlushedGrid>
      <Cell span={6}>
        <Statistic
          value={graph.nodes.length}
          label='Nodes:'
          subtitle={`${hiddenNodes.length} hidden`}
          size='medium'
        />
      </Cell>
      <Cell span={6}>
        <Statistic
          value={graph.edges.length}
          label='Edges:'
          subtitle={`${hiddenEdges.length} hidden`}
          size='medium'
        />
      </Cell>
      <Button
        kind='secondary'
        size='compact'
        onClick={() =>
          dispatch(openDataTableModal(`table_graphList_${index}_nodes`))
        }
      >
        View Node Data
      </Button>
      <Button
        kind='secondary'
        size='compact'
        onClick={() =>
          dispatch(openDataTableModal(`table_graphList_${index}_edges`))
        }
      >
        View Edge Data
      </Button>
    </FlushedGrid>
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
