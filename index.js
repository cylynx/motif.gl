import React from 'react';

import InvestigateExplorer from './src/InvestigateExplorer';
import { Provider } from 'react-redux';
import store from './src/redux/store';

const Investigate = props => {
  const { tabs } = props;
  return (
    <Provider store={store}>
      <InvestigateExplorer tabs={tabs}/>
    </Provider>  
  );
};

export default Investigate;