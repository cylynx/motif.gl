/* eslint-disable import/no-cycle */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { styled } from 'baseui';
import { Block } from 'baseui/block';
import * as Graph from './types';
import { getNodeProperties, getEdgeProperties } from '../../utils/graph-utils';
import { GraphSelectors, Selection } from '../../redux/graph';

export type TooltipProps = null | {
  id: string;
  x: number;
  y: number;
  type: 'edge' | 'node';
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
        ? getNodeProperties(
            graphFlatten.nodes.find((x: Graph.Node) => x.id === tooltip.id),
            'data',
            nodeFields.filter((x: Selection) => !x.selected).map((x) => x.id),
          )
        : getEdgeProperties(
            graphFlatten.edges.find((x: Graph.Edge) => x.id === tooltip.id),
            'data',
            edgeFields.filter((x: Selection) => !x.selected).map((x) => x.id),
          ),
    [graphFlatten, edgeFields, nodeFields, tooltip.id],
  );

  const contents = Object.entries(properties).map(([key, value]) => (
    <Block key={key} display='flex' flexWrap marginTop='8px' marginBottom='8px'>
      <Block paddingRight='12px' marginTop='0' marginBottom='0'>
        <b>{`${key}:`}</b>
      </Block>
      <Block marginTop='0' marginBottom='0'>
        {value}
      </Block>
    </Block>
  ));

  return (
    <StyledInner
      style={{
        position: 'absolute',
        left: tooltip.x,
        top: tooltip.y,
      }}
    >
      {contents}
    </StyledInner>
  );
};

export default Tooltip;
