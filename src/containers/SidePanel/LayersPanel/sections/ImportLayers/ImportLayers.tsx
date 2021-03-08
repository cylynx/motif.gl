import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import DndList from '../../../../../components/DndList';
import {
  changeVisibilityGraphList,
  deleteGraphList,
  updateGraphList,
} from '../../../../../redux/graph/slice';
import {
  GraphData,
  GraphList,
  GraphSelectors,
} from '../../../../../redux/graph';
import useNodeStyle from '../../../../../redux/graph/hooks/useNodeStyle';
import useSearchOption from '../../../SearchPanel/hooks/useSearchOption';
import LayerDetailed from './LayerDetailed';

const ImportLayers = () => {
  const dispatch = useDispatch();
  const { nodeStyle, switchToFixNodeColor } = useNodeStyle();
  const { resetSearchOptions } = useSearchOption();
  const graphList: GraphList = useSelector((state) =>
    GraphSelectors.getGraphList(state),
  );

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
      children: <LayerDetailed graph={graph} />,
    };
  });

  const onChangeOrder = (oldIndex: number, newIndex: number) => {
    dispatch(updateGraphList({ from: oldIndex, to: newIndex }));
  };

  /**
   * Delete single data list.
   *
   * https://github.com/cylynx/motif.gl/pull/73#issuecomment-789393660
   * 1. Switch to original node colour when node style is legend to prevent crash.
   *
   * @param {number} index
   * @return {void}
   */
  const onDelete = (index: number) => {
    dispatch(deleteGraphList(index));
    resetSearchOptions();

    if (nodeStyle.color.id === 'legend') {
      switchToFixNodeColor();
    }
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
