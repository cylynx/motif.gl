import React, { MouseEvent, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'baseui/button';
import { Plus } from 'baseui/icon';
import { Cell } from 'baseui/layout-grid';
import { Block } from 'baseui/block';
import { FlushedGrid, Statistic, FullButton } from '../ui';
import * as Prop from '../../types/Prop';
import { openImportModal, fetchDone } from '../../redux/uiSlice';
import { resetState } from '../../redux/graphSlice';
import ExportDataButton from './ExportDataButton';
import QueryAccordian from './QueryAccordian';
import { getGraph, getUI } from '../../redux/accessors';

const InvestigateMain = () => {
  const dispatch = useDispatch();
  const graphFlatten = useSelector((state) => getGraph(state).graphFlatten);
  const currency = useSelector((state) => getUI(state).currency);

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
        <Cell span={4}>
          <Statistic
            value={graphFlatten ? graphFlatten.nodes.length : 0}
            label='Addresses'
          />
        </Cell>
        <Cell span={4}>
          <Statistic
            value={graphFlatten ? graphFlatten.edges.length : 0 || 0}
            label='Transactions'
          />
        </Cell>
        <Cell span={4}>
          <Statistic value={currency} label='Currency' />
        </Cell>
      </FlushedGrid>
      <br />
      <hr />
      <Block width='100%' display='flex' justifyContent='space-between'>
        <ImportDataButton onClick={onClickImport} />
      </Block>
      <br />
      <QueryAccordian />

      <Block bottom='0%' position='absolute' left='20px' right='20px'>
        <br />
        <br />
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
