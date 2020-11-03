import React, { MouseEvent, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'baseui/button';
import { Cell } from 'baseui/layout-grid';
import { Block } from 'baseui/block';
import { ParagraphSmall } from 'baseui/typography';
import { FlushedGrid, Statistic, FullButton } from '../../components/ui';
import ToggleTokens from '../../components/ToggleTokens';
import Accordion from '../../components/Accordion';
import * as Icon from '../../components/Icons';
import * as Prop from '../../types/Prop';
import {
  openImportModal,
  fetchDone,
  updateNodeSelection,
  updateEdgeSelection,
} from '../../redux/ui-slice';
import { resetState } from '../../redux/graph-slice';
import ExportDataButton from './ExportDataButton';
import ImportLayers from './ImportLayers';
import { getGraph, getUI } from '../../redux';

const InvestigateMain = () => {
  const dispatch = useDispatch();
  const graphList = useSelector((state) => getGraph(state).graphList);
  const graphFlatten = useSelector((state) => getGraph(state).graphFlatten);
  const graphVisible = useSelector((state) => getGraph(state).graphVisible);
  const nodeFields = useSelector((state) => getUI(state).nodeSelection);
  const edgeFields = useSelector((state) => getUI(state).edgeSelection);
  const haveData = graphFlatten && graphVisible;
  const hiddenNodes = graphFlatten.nodes.length - graphVisible.nodes.length;
  const hiddenEdges = graphFlatten.edges.length - graphVisible.edges.length;

  const onClickNodeToken = (index: number, status: boolean) => {
    dispatch(updateNodeSelection({ index, status }));
  };

  const onClickEdgeToken = (index: number, status: boolean) => {
    dispatch(updateEdgeSelection({ index, status }));
  };

  const onClickImport = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(openImportModal());
  };

  const clearState = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(resetState());
    dispatch(fetchDone());
  };

  return (
    <Fragment>
      <FlushedGrid>
        <Cell span={6}>
          <Statistic
            value={haveData ? graphVisible.nodes.length : 0}
            label='Nodes:'
            subtitle={`${hiddenNodes} hidden`}
          />
        </Cell>
        <Cell span={6}>
          <Statistic
            value={haveData ? graphVisible.edges.length : 0}
            label='Edges:'
            subtitle={`${hiddenEdges} hidden`}
          />
        </Cell>
      </FlushedGrid>
      <Block marginTop='scale800'>
        <Accordion
          items={[
            {
              title: (
                <Block display='flex' justifyContent='center'>
                  <Icon.Node style={{ paddingRight: '8px' }} />
                  Node Properties
                </Block>
              ),
              key: 'node properties',
              content: (
                <Fragment>
                  <ParagraphSmall marginTop={0}>
                    Hint: Customize node tooltip by selecting the attributes to
                    include
                  </ParagraphSmall>
                  <ToggleTokens
                    options={graphList.length > 0 ? nodeFields : []}
                    onClick={onClickNodeToken}
                  />
                </Fragment>
              ),
            },
          ]}
        />
      </Block>
      <Block marginTop='scale400'>
        <Accordion
          items={[
            {
              title: (
                <Block display='flex' justifyContent='center'>
                  <Icon.Edge size={16} style={{ paddingRight: '8px' }} />
                  Edge Properties
                </Block>
              ),
              key: 'edge properties',
              content: (
                <Fragment>
                  <ParagraphSmall marginTop={0}>
                    Hint: Customize edge tooltip by selecting the attributes to
                    include
                  </ParagraphSmall>
                  <ToggleTokens
                    options={graphList.length > 0 ? edgeFields : []}
                    onClick={onClickEdgeToken}
                  />
                </Fragment>
              ),
            },
          ]}
        />
      </Block>
      <br />
      <hr />
      <Block width='100%' display='flex' justifyContent='space-between'>
        <ImportDataButton onClick={onClickImport} />
      </Block>
      <ImportLayers />

      <Block bottom='30px' position='absolute' left='20px' right='20px'>
        <Block width='100%' display='flex' justifyContent='space-between'>
          <FullButton
            width='140px'
            kind='primary'
            size='compact'
            onClick={clearState}
          >
            Clear All
          </FullButton>
          <ExportDataButton />
        </Block>
        <br />
      </Block>
    </Fragment>
  );
};

const ImportDataButton: React.FC<Prop.ImportDataButton> = ({ onClick }) => (
  <Button
    kind='tertiary'
    size='compact'
    startEnhancer={() => <Icon.Plus size={20} />}
    onClick={onClick}
  >
    Import Data
  </Button>
);

export default InvestigateMain;
