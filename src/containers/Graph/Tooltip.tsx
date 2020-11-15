import React from 'react';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { StyledInner, StyledPadding } from 'baseui/popover';
import * as Graph from '../../types/Graph';
import { getNodeProperties, getEdgeProperties } from '../../utils/graph-utils';
import { getGraph } from '../../redux';

export type TooltipProps = null | {
  id: string;
  x: number;
  y: number;
  type: 'edge' | 'node';
};

const Tooltip = ({ tooltip }: { tooltip: TooltipProps }) => {
  const graphFlatten = useSelector((state) => getGraph(state).graphFlatten);
  const nodeFields = useSelector((state) => getGraph(state).nodeSelection);
  const edgeFields = useSelector((state) => getGraph(state).edgeSelection);
  const properties =
    tooltip.type === 'node'
      ? getNodeProperties(
          graphFlatten.nodes.find((x: Graph.Node) => x.id === tooltip.id),
          'data',
          nodeFields.filter((x) => !x.selected).map((x) => x.id),
        )
      : getEdgeProperties(
          graphFlatten.edges.find((x: Graph.Edge) => x.id === tooltip.id),
          'data',
          edgeFields.filter((x) => !x.selected).map((x) => x.id),
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
    <div
      style={{
        position: 'absolute',
        left: tooltip.x,
        top: tooltip.y,
        width: '250px',
      }}
    >
      <StyledInner $style={{ opacity: 0.9 }}>
        <StyledPadding>{contents}</StyledPadding>
      </StyledInner>
    </div>
  );
};

export default Tooltip;
