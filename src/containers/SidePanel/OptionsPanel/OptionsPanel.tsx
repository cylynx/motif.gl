import React, { Fragment } from 'react';

import { Block } from 'baseui/block';
import Header from '../Header';

import OptionsLayout from './OptionsLayout';
import OptionsNodeStyles from './OptionsNodeStyles';
import OptionsEdgeStyles from './OptionsEdgeStyles';

const OptionsPanel = () => {
  return (
    <Fragment>
      <Header />
      <OptionsLayout />
      <Block marginTop='scale800' />
      <OptionsNodeStyles />
      <Block marginTop='scale800' />
      <OptionsEdgeStyles />
      <Block marginBottom='scale1000' />
    </Fragment>
  );
};

export default OptionsPanel;
