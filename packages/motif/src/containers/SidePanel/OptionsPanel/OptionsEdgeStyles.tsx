import React, { useMemo } from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { HeadingXSmall } from 'baseui/typography';
import { useSelector } from '../../../redux/hooks';
import { CATEGORICAL_COLOR } from '../../../constants/colors';
import { GraphSelectors } from '../../../redux/graph';
import useEdgeStyle from '../../../redux/graph/hooks/useEdgeStyle';
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
import Legend from '../../../components/Legend';

const MAX_LEGEND_SIZE = CATEGORICAL_COLOR.length;

const OptionsEdgeStyles = () => {
  const [, theme] = useStyletron();
  const { edgeStyle, updateEdgeMappingColor, updateEdgeStyle } = useEdgeStyle();

  const { allEdgeFields, numericEdgeFields, edgeLabelFields } = useSelector(
    (state) => GraphSelectors.getGraphFieldsOptions(state),
  );

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
    <Block data-testid='OptionsEdgeStyles'>
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
      <Card
        $style={{
          backgroundColor: theme.colors.backgroundTertiary,
          marginBottom: theme.sizing.scale300,
        }}
      >
        <NestedForm
          data={edgeWidthFormData}
          key={`${edgeWidthFormData.id}-${edgeWidthFormData.value}`}
        />
      </Card>
      <Card
        $style={{
          backgroundColor: theme.colors.backgroundTertiary,
          marginBottom: theme.sizing.scale300,
        }}
      >
        <SimpleForm
          data={genSimpleForm(edgeLabelForm, edgeStyle, updateEdgeStyle, {
            options: edgeLabelFields,
          })}
        />
        <SimpleForm
          data={genSimpleForm(edgeFontSizeForm, edgeStyle, updateEdgeStyle)}
        />
      </Card>
      <Card
        $style={{
          backgroundColor: theme.colors.backgroundTertiary,
          marginBottom: theme.sizing.scale300,
        }}
      >
        <NestedForm
          data={edgeColorFormData}
          key={`${edgeColorFormData.id}-${edgeColorFormData.value}`}
        />
        {edgeStyle.color &&
          edgeStyle.color.id === 'legend' &&
          edgeStyle.color.mapping && (
            <Legend
              label='Colors'
              kind='edge'
              data={edgeStyle.color.mapping}
              variable={edgeStyle.color.variable}
              colorMap={CATEGORICAL_COLOR}
              maxSize={MAX_LEGEND_SIZE}
              onChangeColor={updateEdgeMappingColor}
            />
          )}
      </Card>
      <Card
        $style={{
          backgroundColor: theme.colors.backgroundTertiary,
          marginBottom: theme.sizing.scale300,
        }}
      >
        <SimpleForm
          data={genSimpleForm(edgePatternForm, edgeStyle, updateEdgeStyle)}
        />
        <SimpleForm
          data={genSimpleForm(edgeArrowForm, edgeStyle, updateEdgeStyle)}
        />
      </Card>
    </Block>
  );
};

export default OptionsEdgeStyles;
