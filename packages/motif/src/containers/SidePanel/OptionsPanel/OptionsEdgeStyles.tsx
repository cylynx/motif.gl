import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
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
  edgeWidthForm,
  edgeColorForm,
  edgePatternForm,
  edgeFontSizeForm,
  edgeLabelForm,
  edgeArrowForm,
} from './constants';
import QuestionMarkTooltip from '../../../components/ui/QuestionMarkTooltip';

const OptionsEdgeStyles = () => {
  const dispatch = useDispatch();

  const edgeStyle = useSelector(
    (state) => GraphSelectors.getGraph(state).styleOptions.edgeStyle,
  );

  const { allEdgeFields, numericEdgeFields, edgeLabelFields } = useSelector((state) =>
    GraphSelectors.getGraphFieldsOptions(state),
  );

  const updateEdgeStyle = (data: any) =>
    dispatch(GraphSlices.changeEdgeStyle(data));

  const edgeWidthPropertyValue = useMemo(() => {
    if (edgeStyle.width.id === 'property') {
      return edgeStyle.width.variable;
    }

    if (numericEdgeFields.length > 0) {
      return numericEdgeFields[0].id;
    }

    return null;
  }, [numericEdgeFields, edgeStyle.width]);

  const edgeWidthFormData = genNestedForm(
    edgeWidthForm,
    edgeStyle,
    updateEdgeStyle,
    {
      'property[0].options': numericEdgeFields,
      'property[0].value': edgeWidthPropertyValue,
    },
  );

  const edgeColorFormData = genNestedForm(
    edgeColorForm,
    edgeStyle,
    updateEdgeStyle,
    {
      'legend[0].options': allEdgeFields,
    },
  );

  return (
    <Card data-testid='OptionsEdgeStyles'>
      <Block display='flex' alignItems='end'>
        <HeadingXSmall
          marginTop={0}
          marginBottom={0}
          color='contentInverseSecondary'
          $style={{ letterSpacing: '1px' }}
        >
          EDGE STYLES
        </HeadingXSmall>
        <QuestionMarkTooltip
          tooltip={
            <Block width='200px'>
              Change the size, color and labels of edges to distinguish them.
            </Block>
          }
        />
      </Block>
      <NestedForm
        data={edgeWidthFormData}
        key={`${edgeWidthFormData.id}-${edgeWidthFormData.value}`}
      />
      <SimpleForm
        data={genSimpleForm(edgeLabelForm, edgeStyle, updateEdgeStyle, {
          options: edgeLabelFields,
        })}
      />
      <SimpleForm
        data={genSimpleForm(edgeFontSizeForm, edgeStyle, updateEdgeStyle)}
      />
      <NestedForm
        data={edgeColorFormData}
        key={`${edgeColorFormData.id}-${edgeColorFormData.value}`}
      />
      <SimpleForm
        data={genSimpleForm(edgePatternForm, edgeStyle, updateEdgeStyle)}
      />
      <SimpleForm
        data={genSimpleForm(edgeArrowForm, edgeStyle, updateEdgeStyle)}
      />
    </Card>
  );
};

export default OptionsEdgeStyles;
