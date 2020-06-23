import React from 'react';

import { addData } from './src/API';
import InvestigateExplorer from './src/InvestigateExplorer';

const Investigate = props => {
  const { tabs, score } = props;

  return (    
    <InvestigateExplorer tabs={tabs} score={score} />    
  );
};

export * from './src/redux';
export { addData };

export default Investigate;