import React from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { HeadingXSmall } from 'baseui/typography';
import { useSelector } from 'react-redux';
import { CATEGORICAL_COLOR } from '../../../constants/colors';
import { GraphSelectors } from '../../../redux/graph';
import useNodeStyle from '../../../redux/graph/hooks/useNodeStyle';
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
import QuestionMarkTooltip from '../../../components/ui/QuestionMarkTooltip';
import Legend from '../../../components/Legend';

const MAX_LEGEND_SIZE = CATEGORICAL_COLOR.length;

const OptionsNodeStyles = () => {
  const [, theme] = useStyletron();
  const { nodeStyle, updateNodeStyle, updateNodeMappingColor } = useNodeStyle();

  const { allNodeFields, nodeLabelFields, numericNodeFields } = useSelector(
    (state) => GraphSelectors.getGraphFieldsOptions(state),
  );

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
    <Block data-testid='OptionsNodeStyles'>
      <Block display='flex' alignItems='end'>
        <HeadingXSmall
          marginTop={0}
          marginBottom={0}
          color='contentInverseSecondary'
          $style={{ letterSpacing: '1px' }}
        >
          NODE STYLES
        </HeadingXSmall>
        <QuestionMarkTooltip
          tooltip={
            <Block width='200px'>
              Change the size, color and labels of nodes to distinguish them.
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
          data={nodeSizeFormData}
          key={`${nodeSizeFormData.id}-${nodeSizeFormData.value}`}
        />
      </Card>
      <Card
        $style={{
          backgroundColor: theme.colors.backgroundTertiary,
          marginBottom: theme.sizing.scale300,
        }}
      >
        <SimpleForm
          data={genSimpleForm(nodeLabelForm, nodeStyle, updateNodeStyle, {
            options: nodeLabelFields,
          })}
        />
        <SimpleForm
          data={genSimpleForm(nodeFontSizeForm, nodeStyle, updateNodeStyle)}
        />
      </Card>
      <Card
        $style={{
          backgroundColor: theme.colors.backgroundTertiary,
          marginBottom: theme.sizing.scale300,
        }}
      >
        <NestedForm
          data={nodeColorFormData}
          key={`${nodeColorFormData.id}-${nodeColorFormData.value}`}
        />
        {nodeStyle.color &&
          nodeStyle.color.id === 'legend' &&
          nodeStyle.color.mapping && (
            <Legend
              label='Colors'
              kind='node'
              data={nodeStyle.color.mapping}
              colorMap={CATEGORICAL_COLOR}
              maxSize={MAX_LEGEND_SIZE}
              onChangeColor={updateNodeMappingColor}
            />
          )}
      </Card>
    </Block>
  );
};

export default OptionsNodeStyles;
