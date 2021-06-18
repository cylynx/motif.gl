import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import {
  GraphSlices,
  GraphData,
  GraphList,
  GraphSelectors,
} from '../../../../../redux/graph';

import useNodeStyle from '../../../../../redux/graph/hooks/useNodeStyle';
import useEdgeStyle from '../../../../../redux/graph/hooks/useEdgeStyle';
import useSearchOption from '../../../SearchPanel/hooks/useSearchOption';
import LayerDetailed from './LayerDetailed';
import Accordion from '../../../../../components/Accordion';

import {
  TableButton,
  VisibilityButton,
  DeleteButton,
} from '../../components/DataListAccordion/AccordionButtons';
import { UISlices } from '../../../../../redux/ui';

const ImportLayers = () => {
  const dispatch = useDispatch();
  const { nodeStyle, switchToFixNodeColor } = useNodeStyle();
  const { edgeStyle, switchToFixEdgeColor } = useEdgeStyle();
  const { resetSearchOptions } = useSearchOption();
  const graphList: GraphList = useSelector((state) =>
    GraphSelectors.getGraphList(state),
  );

  /**
   * Delete single data list.
   *
   * https://github.com/cylynx/motif.gl/pull/73#issuecomment-789393660
   * 1. Switch to original node colour when node style is legend to prevent crash.
   * 2. Reset search results in search panel to prevent errors.
   *
   * @param {number} index
   * @return {void}
   */
  const onDelete = (index: number) => {
    dispatch(GraphSlices.deleteGraphList(index));
    resetSearchOptions();

    if (nodeStyle.color.id === 'legend') {
      switchToFixNodeColor();
    }
    if (edgeStyle.color.id === 'legend') {
      switchToFixEdgeColor();
    }
  };

  const onChangeVisibility = (index: number, isVisible: boolean) => {
    dispatch(GraphSlices.changeVisibilityGraphList({ index, isVisible }));
    resetSearchOptions();
  };

  const displayTabularData = (index: number): void => {
    dispatch(UISlices.openDataTableModal(`table_${index}`));
  };

  const items = graphList.map((graph: GraphData, index: number) => {
    const title: string = graph.metadata?.title ?? `import ${index}`;
    const isVisible: boolean = graph.metadata?.visible ?? true;

    const actionButtons = (
      <Block>
        <TableButton onClick={() => displayTabularData(index)} />
        <VisibilityButton
          isVisible={isVisible}
          onClick={() => onChangeVisibility(index, !isVisible)}
        />
        <DeleteButton
          onClick={() => onDelete(index)}
          tooltip='Delete Layer'
          shape='round'
        />
      </Block>
    );

    const content = <LayerDetailed graph={graph} index={index} />;

    return {
      key: index,
      title,
      content,
      actionButtons,
      expanded: false,
    };
  });

  return (
    <Block overflow='auto' marginTop='scale300'>
      {items
        .map((x) => (
          <Block key={x.key} marginTop='scale300'>
            <Accordion
              title={x.title}
              content={x.content}
              actionButtons={x.actionButtons}
              expanded={x.expanded}
              data-testid='DataListAccordion'
              width='full'
            />
          </Block>
        ))
        .reverse()}
    </Block>
  );
};

export default ImportLayers;
