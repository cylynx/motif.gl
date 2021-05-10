import React from 'react';

import { Block } from 'baseui/block';
import Header from '../Header';

import OptionsLayout from './OptionsLayout';
import OptionsNodeStyles from './OptionsNodeStyles';
import OptionsEdgeStyles from './OptionsEdgeStyles';

const OptionsPanel = () => {
  return (
    <Block data-testid='options-panel'>
      <Header />
      <OptionsLayout />
      <Block marginTop='scale800' />
      <OptionsNodeStyles />
      <Block marginTop='scale800' />
      <OptionsEdgeStyles />
      <Block marginBottom='scale1000' />
    </Block>
  );
};

export default OptionsPanel;
