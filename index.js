import React, { useEffect } from 'react';

import { setScore } from './src/redux/graphInitSlice';
import InvestigateExplorer from './src/InvestigateExplorer';
import { Provider } from 'react-redux';
import store from './src/redux/store';

const Investigate = props => {
  const { tabs, data, score } = props;

  useEffect(() => {
    store.dispatch(setScore(score));
  });

  return (
    <Provider store={store}>
      <InvestigateExplorer tabs={tabs} data={data} />
    </Provider>  
  );
};

export default Investigate;