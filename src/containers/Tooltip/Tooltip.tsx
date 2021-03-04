import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { styled } from 'baseui';
import { Block } from 'baseui/block';
import {
  GraphSelectors,
  Selection,
  GraphUtils,
  Edge,
  Node,
} from '../../redux/graph';
import { extractIntegerFromString } from '../../utils/data-utils';
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
  backgroundColor: $theme.colors.backgroundTertiary,
  color: $theme.colors.contentPrimary,
  opacity: 0.9,
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
  const properties = useMemo(
    () =>
      tooltip.type === 'node'
        ? GraphUtils.getNodeProperties(
            graphFlatten.nodes.find((x: Node) => x.id === tooltip.id),
            'data',
            nodeFields.filter((x: Selection) => !x.selected).map((x) => x.id),
          )
        : GraphUtils.getEdgeProperties(
            graphFlatten.edges.find((x: Edge) => x.id === tooltip.id),
            'data',
            edgeFields.filter((x: Selection) => !x.selected).map((x) => x.id),
          ),
    [graphFlatten, edgeFields, nodeFields, tooltip.id],
  );

  const contents = Object.entries(properties).map(([key, value]) => (
    <Block key={key} display='flex' flexWrap>
      <Block paddingRight='12px' marginTop='0' marginBottom='0'>
        <b>{`${key}:`}</b>
      </Block>
      <Block
        marginTop='0'
        marginBottom='0'
        overrides={{
          Block: {
            style: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          },
        }}
      >
        {value}
      </Block>
    </Block>
  ));

  return (
    <StyledInner
      style={{
        position: 'absolute',
        // Adjust for the side navbar and panel (if open)
        left: tooltip.x + leftLayerWidthPx + sideNavbarWidthPx,
        top: tooltip.y,
        padding: '8px 10px',
        fontSize: '14px',
        lineHeight: '15px',
      }}
    >
      {contents}
    </StyledInner>
  );
};

export default Tooltip;
