import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { DarkTheme, ThemeProvider } from 'baseui';
import { ParagraphSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { StyledInner, StyledPadding } from 'baseui/popover';
import * as Graph from '../../types/Graph';
import * as Prop from '../../types/Prop';
import { flattenObject } from '../../processors/data-processors';
import { getGraph } from '../../redux';

const Tooltip: React.FC<Prop.TooltipComponent> = ({ info }) => {
  const graphFlatten = useSelector((state) => getGraph(state).graphFlatten);
  const { obj, type } = info.selected;

  const selectedInfo =
    type === 'node'
      ? graphFlatten.nodes.find((x: Graph.Node) => x.id === obj.id)
      : graphFlatten.edges.find((x: Graph.Edge) => x.id === obj.id);

  const flattenInfo = flattenObject(selectedInfo);

  const contents = Object.keys(flattenInfo).map((key) => (
    <Block key={key} display='flex' flexWrap marginTop='8px' marginBottom='8px'>
      <ParagraphSmall paddingRight='12px' marginTop='0' marginBottom='0'>
        <b>{`${key}:`}</b>
      </ParagraphSmall>
      <ParagraphSmall marginTop='0' marginBottom='0'>
        {flattenInfo[key]}
      </ParagraphSmall>
    </Block>
  ));

  return (
    <ThemeProvider theme={DarkTheme}>
      <StyledInner style={{ opacity: '0.9' }}>
        <StyledPadding>{contents}</StyledPadding>
      </StyledInner>
    </ThemeProvider>
  );
};

export default Tooltip;
