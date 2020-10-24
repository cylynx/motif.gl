import React, { MouseEvent, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VscCircleOutline } from 'react-icons/vsc';
import { HiOutlineShare } from 'react-icons/hi';
import { Button } from 'baseui/button';
import { Plus } from 'baseui/icon';
import { Cell } from 'baseui/layout-grid';
import { Block } from 'baseui/block';
import { LabelLarge, ParagraphLarge } from 'baseui/typography';
import { Accordion, Content, FlushedGrid, Statistic, FullButton } from '../ui';
import * as Prop from '../../types/Prop';
import { openImportModal, fetchDone } from '../../redux/ui-slice';
import { resetState } from '../../redux/graph-slice';
import ExportDataButton from './ExportDataButton';
import QueryAccordian from './QueryAccordian';
import { getGraph, getUI } from '../../redux';

const InvestigateMain = () => {
  const dispatch = useDispatch();
  const graphFlatten = useSelector((state) => getGraph(state).graphFlatten);
  const graphVisible = useSelector((state) => getGraph(state).graphVisible);
  const haveData = graphFlatten && graphVisible;
  const hiddenNodes = graphFlatten.nodes.length - graphVisible.nodes.length;
  const hiddenEdges = graphFlatten.edges.length - graphVisible.edges.length;

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
          icon={<VscCircleOutline size={16} />}
          items={[
            {
              title: 'Node Properties',
              key: 'node properties',
              content: 'Hello World',
            },
          ]}
        />
      </Block>
      <Block marginTop='scale400'>
        <Accordion
          icon={<HiOutlineShare size={16} />}
          items={[
            {
              title: 'Edge Properties',
              key: 'edge properties',
              content: 'Hello World',
            },
          ]}
        />
      </Block>
      <br />
      <hr />
      <Block width='100%' display='flex' justifyContent='space-between'>
        <ImportDataButton onClick={onClickImport} />
      </Block>
      <br />
      <QueryAccordian />

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
    startEnhancer={() => <Plus size={24} />}
    onClick={onClick}
  >
    Import Data
  </Button>
);

export default InvestigateMain;
