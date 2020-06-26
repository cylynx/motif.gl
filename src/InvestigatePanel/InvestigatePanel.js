import React from 'react';

import { Label1 } from 'baseui/typography';
import { useSelector } from 'react-redux';
import InvestigateMain from './InvestigateMain';
import InvestigateDetailed from './InvestigateDetailed';
import { getGraph } from '../Utilities/accessors';

const InvestigatePanel = () => {
  const detailedSelection = useSelector(
    state => getGraph(state).detailedSelection
  );

  return (
    <>
      <Label1>Blocklynx</Label1>
      <br />
      {detailedSelection.data ? <InvestigateDetailed /> : <InvestigateMain />}
    </>
  );
};

export default InvestigatePanel;
