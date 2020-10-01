import React, { useState, Fragment } from 'react';

import { useSelector } from 'react-redux';
import InvestigateMain from './InvestigateMain';
import InvestigateDetailed from './InvestigateDetailed';
import { getGraph, getUI } from '../../redux';
import { EditableField } from '../ui';

const InvestigatePanel = () => {
  const detailedSelection = useSelector(
    (state) => getGraph(state).detailedSelection,
  );
  const name = useSelector((state) => getUI(state).name);
  const [value, setValue] = useState(useSelector((state) => getUI(state).name));

  return (
    <Fragment>
      <EditableField
        text={value}
        iconPosition='right'
        onSubmit={(text) => setValue(text)}
      />
      <br />
      {detailedSelection.data ? <InvestigateDetailed /> : <InvestigateMain />}
    </Fragment>
  );
};

export default InvestigatePanel;
