// @ts-nocheck
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { updateGraphList, deleteGraphList } from '../../redux/graph-slice';
import { DataDndList } from '../ui';
import * as Graph from '../../types/Graph';
import { getGraph } from '../../redux';

const ImportLayers = () => {
  const dispatch = useDispatch();
  const graphList = useSelector((state) => getGraph(state).graphList);
  const importItems = graphList.map((query: Graph.Data, index: number) => {
    let title = `import ${index}`;
    if (query.metadata?.title) {
      title = query.metadata.title;
    }
    return { key: index, title };
  });

  const onUpdateGraphList = (oldIndex: number, newIndex: number) => {
    dispatch(updateGraphList({ from: oldIndex, to: newIndex }));
  };

  const onDeleteGraphList = (index: number) => {
    dispatch(deleteGraphList(index));
  };

  return (
    <Block overflow='auto' maxHeight='calc(100vh - 200px - 150px)'>
      <DataDndList
        items={importItems}
        onChangeOrder={onUpdateGraphList}
        onDelete={onDeleteGraphList}
      />
    </Block>
  );
};

export default ImportLayers;
