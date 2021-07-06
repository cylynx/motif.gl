import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { styled } from 'baseui';
import { Block } from 'baseui/block';
import { ParagraphSmall, LabelMedium } from 'baseui/typography';
import {
  GraphSelectors,
  Selection,
  GraphUtils,
  Edge,
  Node,
} from '../../redux/graph';
import {
  extractIntegerFromString,
  removeEmptyValueInObject,
} from '../../utils/data-utils/data-utils';
import { SIDE_NAVBAR_WIDTH } from '../../constants/widget-units';

export type TooltipProps = null | {
  id: string;
  x: number;
  y: number;
  type: 'edge' | 'node';
  leftLayerWidth: string;
};

export const StyledInner = styled('div', ({ $theme }) => ({
  width: '250px',
  backgroundColor: $theme.colors.tooltipBackground,
  color: $theme.colors.contentPrimary,
  paddingTop: $theme.sizing.scale400,
  paddingBottom: $theme.sizing.scale400,
  paddingRight: $theme.sizing.scale600,
  paddingLeft: $theme.sizing.scale600,
  borderRadius: $theme.borders.radius200,
}));

const Tooltip = ({ tooltip }: { tooltip: TooltipProps }) => {
  const leftLayerWidthPx: number = extractIntegerFromString(
    tooltip.leftLayerWidth,
  );
  const sideNavbarWidthPx: number = extractIntegerFromString(SIDE_NAVBAR_WIDTH);
  const graphFlatten = useSelector(
    (state) => GraphSelectors.getGraph(state).graphFlatten,
  );
  const nodeFields: Selection[] = useSelector(
    (state) => GraphSelectors.getGraph(state).nodeSelection,
  );
  const edgeFields: Selection[] = useSelector(
    (state) => GraphSelectors.getGraph(state).edgeSelection,
  );

  /**
   * Omit array or object value from the tooltip for aesthethic
   * Change requested on July 6.
   */
  const properties = useMemo(() => {
    if (tooltip.type === 'node') {
      const nodeProperties = GraphUtils.getNodeProperties(
        graphFlatten.nodes.find((x: Node) => x.id === tooltip.id),
        'data',
        nodeFields.filter((x: Selection) => !x.selected).map((x) => x.id),
      );

      removeEmptyValueInObject(nodeProperties);

      return nodeProperties;
    }

    // tooltip type is edge
    const edgeProperties = GraphUtils.getEdgeProperties(
      graphFlatten.edges.find((x: Edge) => x.id === tooltip.id),
      'data',
      edgeFields.filter((x: Selection) => !x.selected).map((x) => x.id),
    );

    removeEmptyValueInObject(edgeProperties);

    return edgeProperties;
  }, [graphFlatten, edgeFields, nodeFields, tooltip.id]);

  const contents = Object.entries(properties).map(([key, value]) => (
    <Block key={key} display='flex' flexWrap>
      <LabelMedium paddingRight='scale100' color='contentInverseSecondary'>
        {`${key}:`}
      </LabelMedium>
      <ParagraphSmall marginTop='0' marginBottom='0'>
        {String(value ?? '')}
      </ParagraphSmall>
    </Block>
  ));

  return (
    <StyledInner
      style={{
        position: 'absolute',
        // Adjust for the side navbar and panel (if open)
        left: tooltip.x + leftLayerWidthPx + sideNavbarWidthPx,
        top: tooltip.y,
      }}
    >
      {contents}
    </StyledInner>
  );
};

export default Tooltip;
