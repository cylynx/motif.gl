import React, { Fragment } from 'react';

import { Label1 } from 'baseui/typography';
import { useSelector } from 'react-redux';
import InvestigateMain from './InvestigateMain';
import InvestigateDetailed from './InvestigateDetailed';
import { getGraph, getUI } from '../../redux';

const InvestigatePanel = () => {
  const detailedSelection = useSelector(
    (state) => getGraph(state).detailedSelection,
  );
  const name = useSelector((state) => getUI(state).name);

  return (
    <Fragment>
      <Label1>{name}</Label1>
      <br />
      {detailedSelection.data ? <InvestigateDetailed /> : <InvestigateMain />}
    </Fragment>
  );
};

export default InvestigatePanel;
