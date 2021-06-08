import React from 'react';

import { HeadingXSmall } from 'baseui/typography';
import { useDispatch, useSelector } from 'react-redux';
import { GraphSlices, GraphSelectors } from '../../../redux/graph';
import { Card } from '../../../components/ui';
import {
  NestedForm,
  genNestedForm,
  SimpleForm,
  genSimpleForm,
} from '../../../components/form';

import {
  nodeSizeForm,
  nodeColorForm,
  nodeFontSizeForm,
  nodeLabelForm,
} from './constants';
import QuestionMarkTooltip from '../../../components/FormSelectWithTooltip/QuestionMarkTooltip';

const OptionsNodeStyles = () => {
  const dispatch = useDispatch();

  const nodeStyle = useSelector(
    (state) => GraphSelectors.getGraph(state).styleOptions.nodeStyle,
  );

  const {
    allNodeFields,
    nodeLabelFields,
    numericNodeFields,
  } = useSelector((state) => GraphSelectors.getGraphFieldsOptions(state));

  const updateNodeStyle = (data: any) => {
    dispatch(GraphSlices.changeNodeStyle(data));
  };

  const nodeSizeFormData = genNestedForm(
    nodeSizeForm,
    nodeStyle,
    updateNodeStyle,
    {
      'property[0].options': numericNodeFields,
      'property[0].value':
        numericNodeFields.length > 0 ? numericNodeFields[0].id : null,
    },
  );

  const nodeColorFormData = genNestedForm(
    nodeColorForm,
    nodeStyle,
    updateNodeStyle,
    {
      'legend[0].options': allNodeFields,
    },
  );

  return (
    <Card data-testid='OptionsNodeStyles'>
      <HeadingXSmall
        marginTop={0}
        marginBottom={0}
        color='contentInverseSecondary'
        $style={{ letterSpacing: '1px' }}
      >
        NODE STYLES
        <QuestionMarkTooltip tooltip='node styles' />
      </HeadingXSmall>
      <NestedForm
        data={nodeSizeFormData}
        key={`${nodeSizeFormData.id}-${nodeSizeFormData.value}`}
      />
      <SimpleForm
        data={genSimpleForm(nodeLabelForm, nodeStyle, updateNodeStyle, {
          options: nodeLabelFields,
        })}
      />
      <NestedForm
        data={nodeColorFormData}
        key={`${nodeColorFormData.id}-${nodeColorFormData.value}`}
      />
      <SimpleForm
        data={genSimpleForm(nodeFontSizeForm, nodeStyle, updateNodeStyle)}
      />
    </Card>
  );
};

export default OptionsNodeStyles;
