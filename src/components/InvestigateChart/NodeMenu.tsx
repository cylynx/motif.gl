import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { DarkTheme, ThemeProvider } from 'baseui';
import { Label3, Paragraph3 } from 'baseui/typography';
import { StyledInner, StyledPadding } from 'baseui/popover';
import { TriGrid, Hash } from '../ui';
import * as Graph from '../../types/Graph';
import * as Prop from '../../types/Prop';
import { timeConverter } from '../../utils/utils';
import { getGraph } from '../../redux';

const NodeMenu: React.FC<Prop.NodeMenu> = ({ menu }) => {
  const graphFlatten = useSelector((state) => getGraph(state).graphFlatten);
  const { data } = graphFlatten.nodes.find(
    (x: Graph.Node) => x.id === menu.node.id,
  );

  return (
    <ThemeProvider theme={DarkTheme}>
      <StyledInner style={{ opacity: '0.9' }}>
        <StyledPadding>
          <Label3>Address:</Label3>
          <Hash
            style={{ overflowWrap: 'break-word', width: '220px' }}
            text={data.label}
          />
          <TriGrid
            startComponent={
              <Fragment>
                <Label3>Category:</Label3>
                <Paragraph3>{data.category}</Paragraph3>
              </Fragment>
            }
            midComponent={
              data.entity && (
                <Fragment>
                  <Label3>Entity:</Label3>
                  <Paragraph3>{data.entity}</Paragraph3>
                </Fragment>
              )
            }
            span={[6, 6]}
          />
          {data.created_ts_unix && (
            <Fragment>
              <br />
              <Label3>Created timestamp</Label3>
              <Paragraph3>{timeConverter(data.created_ts_unix)}</Paragraph3>
            </Fragment>
          )}
        </StyledPadding>
      </StyledInner>
    </ThemeProvider>
  );
};

export default NodeMenu;
