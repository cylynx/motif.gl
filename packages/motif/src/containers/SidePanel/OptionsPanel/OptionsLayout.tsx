import React from 'react';
import { Block } from 'baseui/block';
import { HeadingXSmall } from 'baseui/typography';
import { useDispatch, useSelector } from 'react-redux';

import { GraphSlices, GraphSelectors } from '../../../redux/graph';
import { Card } from '../../../components/ui';
import { NestedForm, genNestedForm } from '../../../components/form';
import { layoutForm } from './constants';
import QuestionMarkTooltip from '../../../components/ui/QuestionMarkTooltip';

const OptionsLayout = () => {
  const dispatch = useDispatch();

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

  const updateLayout = (data: any) => dispatch(GraphSlices.changeLayout(data));

  const formData = genNestedForm(layoutForm, layoutOptions, updateLayout, {
    'grid[1].options': layoutFields,
    'concentric[1].options': layoutFields,
    'radial[2].options': nodeIds,
    'radial[2].value': layout.focusNode || nodeIds[0]?.id || '',
  });

  return (
    <Card data-testid='OptionsLayout'>
      <Block display='flex' alignItems='center'>
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
