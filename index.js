import React from 'react';

import InvestigateExplorer from './src/InvestigateExplorer';
import { Provider } from 'react-redux';
import store from './src/redux/store';

const Investigate = props => {
  const { tabs, data, score, getRecentTrans } = props;

  return (
    <Provider store={store}>
      <InvestigateExplorer tabs={tabs} data={data} getRecentTrans={getRecentTrans} score={score} />
    </Provider>  
  );
};

export default Investigate;