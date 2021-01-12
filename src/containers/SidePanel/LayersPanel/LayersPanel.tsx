import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { ParagraphSmall } from 'baseui/typography';
import { Statistic } from '../../../components/ui';
import ToggleTokens from '../../../components/ToggleTokens';
import Accordion from '../../../components/Accordion';
import * as Icon from '../../../components/Icons';
import ImportLayers from './ImportLayers';
import {
  ImportDataButton,
  ClearDataButton,
  ToggleAllButton,
} from './LayersPanelButtons';
import {
  updateNodeSelection,
  updateAllNodeSelection,
  updateEdgeSelection,
  updateAllEdgeSelection,
  getGraph,
  getGraphList,
  getGraphVisible,
  getGraphFlatten,
} from '../../../redux';
import Header from '../Header/Header';

const LayersPanel = () => {
  const dispatch = useDispatch();
  const graphList = useSelector((state) => getGraphList(state));
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphVisible = useSelector((state) => getGraphVisible(state));
  const nodeFields = useSelector((state) => getGraph(state).nodeSelection);
  const edgeFields = useSelector((state) => getGraph(state).edgeSelection);
  const haveData = graphFlatten && graphVisible;
  const isAllNodeSelected = nodeFields.every((f) => f.selected === true);
  const isAllEdgeSelected = edgeFields.every((f) => f.selected === true);
  const hiddenNodes = graphFlatten.nodes.length - graphVisible.nodes.length;
  const hiddenEdges = graphFlatten.edges.length - graphVisible.edges.length;

  const onClickNodeToken = (index: number, status: boolean) => {
    dispatch(updateNodeSelection({ index, status }));
  };

  const onSelectAllNodeToken = () => {
    dispatch(updateAllNodeSelection({ status: !isAllNodeSelected }));
  };

  const onClickEdgeToken = (index: number, status: boolean) => {
    dispatch(updateEdgeSelection({ index, status }));
  };

  const onSelectAllEdgeToken = () => {
    dispatch(updateAllEdgeSelection({ status: !isAllEdgeSelected }));
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
          data-testid='nodes-count'
        />
        <Statistic
          value={haveData ? graphVisible.edges.length : 0}
          label='Edges:'
          subtitle={`${hiddenEdges} hidden`}
          data-testid='edges-count'
        />
      </Block>
      <Block marginTop='scale800'>
        <Accordion
          data-testid='node-properties-accordion'
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
                  <Block display='flex'>
                    <ParagraphSmall marginTop={0}>
                      Hint: Select node properties to display in tooltip
                    </ParagraphSmall>
                    <ToggleAllButton
                      selected={isAllNodeSelected}
                      onClick={onSelectAllNodeToken}
                    />
                  </Block>
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
      <Block marginTop='scale300'>
        <Accordion
          data-testid='edge-properties-accordion'
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
                  <Block display='flex'>
                    <ParagraphSmall marginTop={0}>
                      Hint: Select edge properties to display in tooltip
                    </ParagraphSmall>
                    <ToggleAllButton
                      selected={isAllEdgeSelected}
                      onClick={onSelectAllEdgeToken}
                    />
                  </Block>
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
        <ClearDataButton />
        <ImportDataButton />
      </Block>
      <ImportLayers />
      <Block marginBottom='scale1000' />
    </Fragment>
  );
};

export default LayersPanel;
