import React from 'react';

import { Label1 } from 'baseui/typography';
import { useSelector } from 'react-redux';
import { RRLink } from '@blocklynx/ui';
import InvestigateMain from './InvestigateMain';
import InvestigateDetailed from './InvestigateDetailed';
import * as ROUTES from '../Utilities/routes';
import { getGraph } from '../Utilities/accessors';

const InvestigatePanel = () => {
  const detailedSelection = useSelector(
    state => getGraph(state).detailedSelection
  );

  return (
    <>
      <Label1>
        <RRLink to={ROUTES.LANDING}>Blocklynx</RRLink>
      </Label1>

      <br />
      {detailedSelection.data ? <InvestigateDetailed /> : <InvestigateMain />}
    </>
  );
};

export default InvestigatePanel;
