import React, { useState } from 'react';
import { HeadingSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Tabs, TabsProps, Tab } from 'baseui/tabs';
import * as Prop from '../../types/Prop';

import QueryFile from '../QueryFile';
import { fileTip } from './Tips';

type StyledTabsProps = TabsProps & {
  children: React.ReactNode;
};

const ImportWizard: React.FC<Prop.ImportWizard> = ({ tabs }) => {
  const [activeKey, setActiveKey] = useState('0');
  // eslint-disable-next-line no-shadow
  const onChangeTab = ({ activeKey }: { activeKey: any }) => {
    setActiveKey(activeKey);
  };
  return (
    <Block width='600px'>
      <HeadingSmall> Add Data To Graph </HeadingSmall>
      <StyledTabs onChange={onChangeTab} activeKey={activeKey}>
        <Tab title='File'>
          <QueryFile info='Loads data in JSON file format' tooltip={fileTip} />
        </Tab>
        {tabs &&
          tabs.map((tab) => (
            <Tab title={tab.title} key={tab.idx}>
              {tab.component}
            </Tab>
          ))}
      </StyledTabs>
    </Block>
  );
};

const StyledTabs = ({ children, ...rest }: StyledTabsProps) => (
  <Tabs
    overrides={{
      TabContent: {
        style: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
      TabBar: {
        style: ({ $theme }) => ({
          backgroundColor: $theme.colors.backgroundPrimary,
        }),
      },
    }}
    {...rest}
  >
    {children}
  </Tabs>
);

export default ImportWizard;
