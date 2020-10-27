// @ts-nocheck
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import {
  updateGraphList,
  deleteGraphList,
  changeVisibilityGraphList,
} from '../../redux/graph-slice';
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
    console.log(index, query.metadata?.visible);
    return {
      key: index,
      title,
      isVisible:
        typeof query.metadata?.visible === 'undefined'
          ? true
          : query.metadata?.visible,
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
      <DataDndList
        items={importItems}
        onChangeOrder={onChangeOrder}
        onChangeVisibility={onChangeVisibility}
        onDelete={onDelete}
      />
    </Block>
  );
};

export default ImportLayers;
