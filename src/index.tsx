import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import Investigate from './components/InvestigateExplorer';
import addData from './processors';

export * from './redux';
export * from './utils/utils';
export { Investigate, addData };
