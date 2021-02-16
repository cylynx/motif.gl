import React, { Fragment, useState } from 'react';

import { Tabs, Tab, FILL } from 'baseui/tabs-motion';
import { Block } from 'baseui/block';
import { Select, Value, TYPE } from 'baseui/select';
import { Theme } from 'baseui/theme';

import { TActiveKey } from './types';
import Header from '../Header';

const tabContentStyle = ({ $theme }: { $theme: Theme }) => ({
  paddingLeft: $theme.sizing.scale300,
  paddingRight: $theme.sizing.scale300,
  paddingTop: $theme.sizing.scale600,
  paddingBottom: $theme.sizing.scale300,
});

const TabsMotion = () => {
  const [activeKey, setActiveKey] = useState<number>(0);

  const onTabChange = ({ activeKey }: TActiveKey) => {
    setActiveKey(activeKey);
  };

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onTabChange}
      activateOnFocus={false}
      fill={FILL.fixed}
      overrides={{
        // @ts-ignore
        TabContent: {
          style: tabContentStyle,
        },
      }}
    >
      <Tab title={<div>Node</div>}>
        <Block>
          <SingleStringSelect />
        </Block>
      </Tab>
      <Tab title='Edge'>
        <div style={{ color: 'white' }}>Fear is the mind-killer.</div>
      </Tab>
    </Tabs>
  );
};

const SingleStringSelect = () => {
  const [value, setValue] = useState<Value>([]);
  return (
    <Select
      options={[
        { id: 'AliceBlue', color: '#F0F8FF' },
        { id: 'AntiqueWhite', color: '#FAEBD7' },
        { id: 'Aqua', color: '#00FFFF' },
        { id: 'Aquamarine', color: '#7FFFD4' },
        { id: 'Azure', color: '#F0FFFF' },
        { id: 'Beige', color: '#F5F5DC' },
      ]}
      labelKey='id'
      valueKey='color'
      placeholder='Choose a color'
      maxDropdownHeight='300px'
      type={TYPE.search}
      onChange={({ value }) => setValue(value)}
      value={value}
      size='compact'
    />
  );
};

const SearchPanel = () => {
  return (
    <Fragment>
      <Header />
      <TabsMotion />
    </Fragment>
  );
};

export default SearchPanel;
