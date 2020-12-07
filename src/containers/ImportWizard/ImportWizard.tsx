import React, { useState } from 'react';
import { HeadingSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Tabs, Tab } from 'baseui/tabs-motion';

import ImportLocalFile from './ImportLocalFile';
import ImportSampleData from './ImportSampleData';

export interface Tab {
  title: string;
  key: string;
  component: React.ReactNode;
}

export interface ImportWizardProps {
  tabs: Tab[];
}

export const defaultImportTabs: Tab[] = [
  { title: 'File', key: 'file', component: <ImportLocalFile /> },
  {
    title: 'Sample Data',
    key: 'sample-data',
    component: <ImportSampleData />,
  },
];

const ImportWizard = ({ tabs }: ImportWizardProps) => {
  const [activeKey, setActiveKey] = useState(tabs[0].key);
  // eslint-disable-next-line no-shadow
  const onChangeTab = ({ activeKey }: { activeKey: any }) => {
    setActiveKey(activeKey);
  };
  return (
    <Block width='700px'>
      <HeadingSmall> Add Data To Graph </HeadingSmall>
      <Tabs onChange={onChangeTab} activeKey={activeKey}>
        {tabs &&
          tabs.map((tab) => (
            <Tab title={tab.title} key={tab.key}>
              {tab.component}
            </Tab>
          ))}
      </Tabs>
    </Block>
  );
};

export default ImportWizard;
