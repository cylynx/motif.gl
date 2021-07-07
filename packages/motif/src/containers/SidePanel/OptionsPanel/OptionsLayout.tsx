import React, { useContext } from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { HeadingXSmall } from 'baseui/typography';
import { useDispatch, useSelector } from 'react-redux';

import { debounce } from 'lodash';
import { GraphRefContext } from '../../Graph';
import {
  GraphSelectors,
  GraphSlices,
  NodePosParams,
} from '../../../redux/graph';
import useLayout from '../../../redux/graph/hooks/useLayout';
import { Card } from '../../../components/ui';
import { NestedForm, genNestedForm } from '../../../components/form';
import { layoutForm } from './constants';
import QuestionMarkTooltip from '../../../components/ui/QuestionMarkTooltip';

const OptionsLayout = () => {
  const [, theme] = useStyletron();
  const { changeGraphLayout } = useLayout();
  const dispatch = useDispatch();
  const { graph } = useContext(GraphRefContext);

  const layout = useSelector(
    (state) => GraphSelectors.getGraph(state).styleOptions.layout,
  );

  const { layoutFields } = useSelector((state) =>
    GraphSelectors.getGraphFieldsOptions(state),
  );

  const nodeIds = useSelector((state) =>
    GraphSelectors.getGraphVisibleNodeOptions(state),
  );

  const layoutOptions = { layout: { id: layout.type, ...layout } };

  const updateLayout = (data: any) => {
    changeGraphLayout(data);
    registerNodePosition();
  };

  const formData = genNestedForm(layoutForm, layoutOptions, updateLayout, {
    'grid[1].options': layoutFields,
    'concentric[1].options': layoutFields,
    'radial[2].options': nodeIds,
    'radial[2].value': layout.focusNode || nodeIds[0]?.id || '',
  });

  /**
   * Update all the node position when layout is changed
   * - For GraphFlatten to remember the node position to handle visibilities.
   */
  const registerNodePosition = debounce(() => {
    const nodePositions: NodePosParams[] = [];
    const nodePosCollection = graph.getNodes().reduce((acc, node) => {
      const { id, x, y } = node.getModel();
      const params: NodePosParams = { nodeId: id, x, y };
      acc.push(params);
      return acc;
    }, nodePositions);

    dispatch(GraphSlices.updateNodePosition(nodePosCollection));
  }, 250);

  return (
    <Card
      data-testid='OptionsLayout'
      $style={{
        backgroundColor: theme.colors.backgroundTertiary,
        marginBottom: theme.sizing.scale300,
      }}
    >
      <Block display='flex' alignItems='end'>
        <HeadingXSmall
          marginTop={0}
          marginBottom={0}
          color='contentInverseSecondary'
          $style={{ letterSpacing: '1px' }}
        >
          LAYOUT
        </HeadingXSmall>

        <QuestionMarkTooltip
          tooltip={
            <Block width='190px'>
              Try different layouts to better visualise your graph. E.g.
              force-directed for a good default, sequential for ordered data or
              xy-coordinates to fix it at a particular location.
            </Block>
          }
        />
      </Block>
      <NestedForm data={formData} key={`${formData.id}-${formData.value}`} />
    </Card>
  );
};

export default OptionsLayout;
