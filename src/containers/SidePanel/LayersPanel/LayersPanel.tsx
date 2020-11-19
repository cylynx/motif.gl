import React, { MouseEvent, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { ParagraphSmall } from 'baseui/typography';
import { Statistic } from '../../../components/ui';
import ToggleTokens from '../../../components/ToggleTokens';
import Accordion from '../../../components/Accordion';
import * as Icon from '../../../components/Icons';
import { openImportModal, fetchDone } from '../../../redux/ui-slice';
import {
  resetState,
  updateNodeSelection,
  updateEdgeSelection,
} from '../../../redux/graph-slice';
import ImportLayers from './ImportLayers';
import {
  getGraph,
  getGraphList,
  getGraphVisible,
  getGraphFlatten,
} from '../../../redux';
import Header from '../Header';

const LayersPanel = () => {
  const dispatch = useDispatch();
  const graphList = useSelector((state) => getGraphList(state));
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphVisible = useSelector((state) => getGraphVisible(state));
  const nodeFields = useSelector((state) => getGraph(state).nodeSelection);
  const edgeFields = useSelector((state) => getGraph(state).edgeSelection);
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
      <Header />
      <Block
        display='flex'
        justifyContent='space-between'
        marginLeft='scale600'
        width='260px'
      >
        <Statistic
          value={haveData ? graphVisible.nodes.length : 0}
          label='Nodes:'
          subtitle={`${hiddenNodes} hidden`}
        />
        <Statistic
          value={haveData ? graphVisible.edges.length : 0}
          label='Edges:'
          subtitle={`${hiddenEdges} hidden`}
        />
      </Block>
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
      <Block marginBottom='scale1000' />
    </Fragment>
  );
};

const ImportDataButton = ({ onClick }: { onClick: (e: MouseEvent) => any }) => (
  <Button
    kind='tertiary'
    size='compact'
    startEnhancer={() => <Icon.Plus size={20} />}
    onClick={onClick}
  >
    Import Data
  </Button>
);

export default LayersPanel;
