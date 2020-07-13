import React from 'react';

import { Label1 } from 'baseui/typography';
import { useSelector } from 'react-redux';
import InvestigateMain from './InvestigateMain';
import InvestigateDetailed from './InvestigateDetailed';
import { getGraph, getUI } from '../../redux/accessors';

const InvestigatePanel: React.FC<{}> = () => {
  const detailedSelection = useSelector(
    (state) => getGraph(state).detailedSelection,
  );
  const name = useSelector((state) => getUI(state).name);

  return (
    <>
      <Label1>{name}</Label1>
      <br />
      {detailedSelection.data ? <InvestigateDetailed /> : <InvestigateMain />}
    </>
  );
};

export default InvestigatePanel;
