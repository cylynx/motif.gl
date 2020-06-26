import React from 'react';

import { Label1 } from 'baseui/typography';
import { useSelector } from 'react-redux';
import InvestigateMain from './InvestigateMain';
import InvestigateDetailed from './InvestigateDetailed';
import { getGraph, getGraphInit } from '../redux/accessors';

const InvestigatePanel = () => {
  const detailedSelection = useSelector(
    state => getGraph(state).detailedSelection
  );
  const name = useSelector(state => getGraphInit(state).name);

  return (
    <>
      <Label1>{name}</Label1>
      <br />
      {detailedSelection.data ? <InvestigateDetailed /> : <InvestigateMain />}
    </>
  );
};

export default InvestigatePanel;
