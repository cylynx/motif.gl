import React from 'react';

import InvestigateExplorer from './src/InvestigateExplorer';
import { Provider } from 'react-redux';
import store from './src/redux/store';

const Investigate = () => {
  return (
    <Provider store={store}>
      <InvestigateExplorer />
    </Provider>  
  );
};

export default Investigate;