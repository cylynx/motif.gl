import React from 'react';
import { useStyletron } from 'baseui';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { LabelSmall, ParagraphSmall } from 'baseui/typography';
import { CATEGORICAL_COLOR } from '../../constants/colors';
import { Card } from '../../components/ui';
import Legend from '../../components/Legend';
import { GraphSelectors } from '../../redux/graph';
import useNodeStyle from '../../redux/graph/hooks/useNodeStyle';
import useEdgeStyle from '../../redux/graph/hooks/useEdgeStyle';

const MAX_LEGEND_SIZE = CATEGORICAL_COLOR.length;

const LegendPopover = () => {
  const [, theme] = useStyletron();
  const { nodeStyle } = useNodeStyle();
  const { edgeStyle } = useEdgeStyle();
  const graphList = useSelector((state) => GraphSelectors.getGraphList(state));

  const haveData: boolean = graphList.length > 0;

  const haveNodeLegend =
    nodeStyle.color &&
    nodeStyle.color.id === 'legend' &&
    nodeStyle.color.mapping;

  const haveEdgeLegend =
    edgeStyle.color &&
    edgeStyle.color.id === 'legend' &&
    edgeStyle.color.mapping;

  return (
    <Block width='220px'>
      <LabelSmall>Legend</LabelSmall>
      {!haveData && (
        <ParagraphSmall color='contentTertiary'>
          Import data to get started.
        </ParagraphSmall>
      )}
      {haveData && !haveNodeLegend && !haveEdgeLegend && (
        <ParagraphSmall color='contentTertiary'>
          Node or edge properties can be mapped to different colors using the
          styles panel.
        </ParagraphSmall>
      )}
      {haveNodeLegend && (
        <Card
          $style={{
            backgroundColor: theme.colors.backgroundTertiary,
            paddingTop: theme.sizing.scale100,
            marginTop: theme.sizing.scale200,
            marginBottom: theme.sizing.scale200,
          }}
        >
          <Legend
            // @ts-ignore
            label={`node: ${nodeStyle.color.variable}`}
            kind='node'
            // @ts-ignore
            data={nodeStyle.color.mapping}
            colorMap={CATEGORICAL_COLOR}
            maxSize={MAX_LEGEND_SIZE}
          />
        </Card>
      )}
      {haveEdgeLegend && (
        <Card
          $style={{
            backgroundColor: theme.colors.backgroundTertiary,
            paddingTop: theme.sizing.scale100,
            marginTop: theme.sizing.scale200,
            marginBottom: theme.sizing.scale200,
          }}
        >
          <Legend
            // @ts-ignore
            label={`edge: ${edgeStyle.color.variable}`}
            kind='edge'
            // @ts-ignore
            data={edgeStyle.color.mapping}
            colorMap={CATEGORICAL_COLOR}
            maxSize={MAX_LEGEND_SIZE}
          />
        </Card>
      )}
    </Block>
  );
};
export default LegendPopover;
