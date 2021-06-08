import React from 'react';

import { HeadingXSmall } from 'baseui/typography';
import { useDispatch, useSelector } from 'react-redux';

import { GraphSlices, GraphSelectors } from '../../../redux/graph';
import { Card } from '../../../components/ui';
import { NestedForm, genNestedForm } from '../../../components/form';
import { layoutForm } from './constants';

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
      <HeadingXSmall
        marginTop={0}
        marginBottom={0}
        color='contentInverseSecondary'
        $style={{ letterSpacing: '1px' }}
      >
        LAYOUT
      </HeadingXSmall>
      <NestedForm data={formData} key={`${formData.id}-${formData.value}`} />
    </Card>
  );
};

export default OptionsLayout;
