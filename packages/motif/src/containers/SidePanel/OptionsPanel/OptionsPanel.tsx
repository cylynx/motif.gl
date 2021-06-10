import React, { useState } from 'react';

import { Block } from 'baseui/block';
import { HeadingMedium } from 'baseui/typography';
import { FILL } from 'baseui/tabs-motion';
import Header from '../Header';
import { Tabs, Tab } from '../../../components/ui';

import OptionsLayout from './OptionsLayout';
import OptionsNodeStyles from './OptionsNodeStyles';
import OptionsEdgeStyles from './OptionsEdgeStyles';

const OptionsPanel = () => {
  const [activeKey, setActiveKey] = useState('nodes');

  const onTabChange = ({ activeKey }) => {
    setActiveKey(activeKey);
  };

  return (
    <Block data-testid='options-panel'>
      <HeadingMedium marginTop='scale300' marginBottom='scale300'>
        Styles
      </HeadingMedium>
      <OptionsLayout />
      <Block marginTop='scale300' />
      <Tabs activeKey={activeKey} onChange={onTabChange} fill={FILL.fixed}>
        <Tab
          title='Node styles'
          key='nodes'
          overrides={{
            Tab: {
              style: ({ $theme }) => {
                return {
                  paddingTop: $theme.sizing.scale300,
                  paddingBottom: $theme.sizing.scale300,
                };
              },
            },
            TabPanel: {
              style: {
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          }}
        >
          <OptionsNodeStyles />
        </Tab>
        <Tab
          title='Edge styles'
          key='edges'
          overrides={{
            Tab: {
              style: ({ $theme }) => {
                return {
                  paddingTop: $theme.sizing.scale300,
                  paddingBottom: $theme.sizing.scale300,
                };
              },
            },
            TabPanel: {
              style: {
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          }}
        >
          <OptionsEdgeStyles />
        </Tab>
      </Tabs>

      <Block marginBottom='scale800' />
    </Block>
  );
};

export default OptionsPanel;
