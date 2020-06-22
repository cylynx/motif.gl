import React from 'react';

import { HeadingSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Tabs, Tab } from 'baseui/tabs';

import QueryFile from '../QueryFile';
import { fileTip } from './Tips';

const ImportWizard = ({ tabs }) => {
  const [activeKey, setActiveKey] = React.useState('0');
  // eslint-disable-next-line no-shadow
  const onChangeTab = ({ activeKey }) => {
    setActiveKey(activeKey);
  };
  return (
    <Block width="600px">
      <HeadingSmall> Add Data To Graph </HeadingSmall>
      <StyledTabs onChange={onChangeTab} activeKey={activeKey}>                
        <Tab title="File">
          <QueryFile info="Loads data in JSON file format" tooltip={fileTip} />
        </Tab>
        {tabs.map((tab, idx) =>           
          <Tab title={tab.type.name}>
          {tab}
          </Tab>
        )}        
      </StyledTabs>
    </Block>
  );
};

const StyledTabs = ({ children, ...rest }) => (
  <Tabs
    overrides={{
      TabContent: {
        style: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
      TabBar: {
        style: ({ $theme }) => {
          return {
            backgroundColor: $theme.colors.backgroundPrimary,
          };
        },
      },
    }}
    {...rest}
  >
    {children}
  </Tabs>
);

export default ImportWizard;
