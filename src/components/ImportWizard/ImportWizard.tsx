import React, { useState } from 'react';
import { HeadingSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Tabs, Tab } from 'baseui/tabs-motion';
import * as Prop from '../../types/Prop';

import ImportLocalFile from './ImportLocalFile';

const ImportWizard: React.FC<Prop.ImportWizard> = ({ tabs }) => {
  const [activeKey, setActiveKey] = useState('0');
  // eslint-disable-next-line no-shadow
  const onChangeTab = ({ activeKey }: { activeKey: any }) => {
    setActiveKey(activeKey);
  };
  return (
    <Block width='700px'>
      <HeadingSmall> Add Data To Graph </HeadingSmall>
      <Tabs onChange={onChangeTab} activeKey={activeKey}>
        <Tab title='File'>
          <ImportLocalFile />
        </Tab>
        {tabs &&
          tabs.map((tab) => (
            <Tab title={tab.title} key={tab.idx}>
              {tab.component}
            </Tab>
          ))}
      </Tabs>
    </Block>
  );
};

export default ImportWizard;
