import React from 'react';
import { useSelector } from 'react-redux';
import { ParagraphSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { StyledInner } from 'baseui/tooltip';
import * as Graph from '../../types/Graph';
import * as Prop from '../../types/Prop';
import { getNodeProperties, getEdgeProperties } from '../../utils/graph-utils';
import { getGraph } from '../../redux';

const Tooltip: React.FC<Prop.TooltipComponent> = ({ info }) => {
  const graphFlatten = useSelector((state) => getGraph(state).graphFlatten);
  const { obj, type } = info.selected;

  const properties =
    type === 'node'
      ? getNodeProperties(
          graphFlatten.nodes.find((x: Graph.Node) => x.id === obj.id),
          'data',
        )
      : getEdgeProperties(
          graphFlatten.edges.find((x: Graph.Edge) => x.id === obj.id),
          'data',
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

  return <StyledInner $style={{ opacity: 0.9 }}>{contents}</StyledInner>;
};

export default Tooltip;
