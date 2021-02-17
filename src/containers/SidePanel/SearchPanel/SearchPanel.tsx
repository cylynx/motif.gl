import React, { Fragment, useState } from 'react';

import { Tabs, Tab } from 'baseui/tabs';
import { Block } from 'baseui/block';
import { Select, Value, TYPE } from 'baseui/select';
import { Theme } from 'baseui/theme';

import { LabelXSmall } from 'baseui/typography';
import { TActiveKey } from './types';
import Header from '../Header';
import Accordion from '../../../components/Accordion';
import * as Icon from '../../../components/Icons';

const TabContentStyle = ({ $theme }: { $theme: Theme }) => ({
  paddingLeft: $theme.sizing.scale300,
  paddingRight: $theme.sizing.scale300,
  paddingTop: $theme.sizing.scale500,
  paddingBottom: $theme.sizing.scale300,
  background: $theme.colors.backgroundTertiary,
});

const TabStyle = ({
  $theme,
  $active,
}: {
  $theme: Theme;
  $active: boolean;
}) => ({
  width: '50%',
  paddingTop: $theme.sizing.scale300,
  paddingBottom: $theme.sizing.scale300,
  fontWeight: $active ? 700 : 400,
  color: $active ? '#06a2a2' : $theme.colors.mono200,
  textAlign: 'center',
  borderBottom: `2px solid ${$active ? '#17806f' : 'transparent'}`,
  ':hover': {
    color: '#06a2a2',
  },
  ':focus': {
    color: '#06a2a2',
  },
});

const TabBarStyle = () => ({
  background: '#0c0b0b',
});

const TabsMotion = () => {
  const [activeKey, setActiveKey] = useState<TActiveKey['activeKey']>('node');

  const onTabChange = ({ activeKey }: TActiveKey) => {
    setActiveKey(activeKey);
  };

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onTabChange}
      overrides={{
        Tab: {
          // @ts-ignore
          style: TabStyle,
        },
        TabContent: {
          style: TabContentStyle,
        },
        TabBar: {
          style: TabBarStyle,
        },
      }}
    >
      <Tab key='node' title='Node'>
        <Block>
          <SingleStringSelect />

          <Block color='primary300' marginTop='scale800'>
            <LabelXSmall>Selected 7 Nodes</LabelXSmall>
          </Block>

          <Block marginTop='scale200'>
            <Accordion
              overrides={{
                Content: {
                  style: ({ $expanded, $theme }) => ({
                    paddingTop: $expanded ? $theme.sizing.scale300 : 0,
                    paddingBottom: $expanded ? $theme.sizing.scale300 : 0,
                    paddingLeft: $theme.sizing.scale300,
                    paddingRight: $theme.sizing.scale300,
                    backgroundColor: '#323742',
                    color: $theme.colors.mono200,
                    borderBottomWidth: 0,
                  }),
                },
                Header: {
                  style: ({ $theme }) => ({
                    ...$theme.typography.ParagraphSmall,
                    textTransform: 'capitalize',
                    paddingLeft: $theme.sizing.scale300,
                    paddingRight: $theme.sizing.scale300,
                    paddingTop: $theme.sizing.scale200,
                    paddingBottom: $theme.sizing.scale200,
                    backgroundColor: $theme.colors.backgroundSecondary,
                    color: $theme.colors.backgroundInverseSecondary,
                    borderBottomStyle: 'none',
                  }),
                },
                PanelContainer: {
                  style: ({ $theme }) => ({
                    marginBottom: $theme.sizing.scale500,
                  }),
                },
                ToggleIcon: {
                  component: () => {
                    return <Icon.ChevronDown />;
                  },
                },
              }}
              items={[
                {
                  title: (
                    <Block display='flex' justifyContent='center'>
                      Sample Data
                    </Block>
                  ),
                  key: 'sample-data',
                  content: (
                    <table id='sample-data' style={{ fontSize: '12px' }}>
                      <tbody>
                        <tr>
                          <th style={{ width: '35%' }}>
                            Company Data For Sales
                          </th>
                          <td style={{ width: '65%', verticalAlign: 'top' }}>
                            Alfreds Futterkiste
                          </td>
                        </tr>
                        <tr>
                          <th>Contact</th>
                          <td>Maria Anders</td>
                        </tr>
                        <tr>
                          <th>Country</th>
                          <td>Germany</td>
                        </tr>
                      </tbody>
                    </table>
                  ),
                },
                {
                  title: (
                    <Block display='flex' justifyContent='center'>
                      Sample Data
                    </Block>
                  ),
                  key: 'sample-data2',
                  content: (
                    <table id='sample-data2' style={{ fontSize: '12px' }}>
                      <tbody>
                        <tr>
                          <th style={{ width: '35%' }}>
                            Company Data For Sales
                          </th>
                          <td style={{ width: '65%', verticalAlign: 'top' }}>
                            Alfreds Futterkiste
                          </td>
                        </tr>
                        <tr>
                          <th>Contact</th>
                          <td>Maria Anders</td>
                        </tr>
                        <tr>
                          <th>Country</th>
                          <td>Germany</td>
                        </tr>
                      </tbody>
                    </table>
                  ),
                },
                {
                  title: (
                    <Block display='flex' justifyContent='center'>
                      Sample Data
                    </Block>
                  ),
                  key: 'sample-data3',
                  content: (
                    <table id='sample-data3' style={{ fontSize: '12px' }}>
                      <tbody>
                        <tr>
                          <th style={{ width: '35%' }}>
                            Company Data For Sales
                          </th>
                          <td style={{ width: '65%', verticalAlign: 'top' }}>
                            Alfreds Futterkiste
                          </td>
                        </tr>
                        <tr>
                          <th>Contact</th>
                          <td>Maria Anders</td>
                        </tr>
                        <tr>
                          <th>Country</th>
                          <td>Germany</td>
                        </tr>
                      </tbody>
                    </table>
                  ),
                },
                {
                  title: (
                    <Block display='flex' justifyContent='center'>
                      Sample Data
                    </Block>
                  ),
                  key: 'sample-data4',
                  content: (
                    <table id='sample-data4' style={{ fontSize: '12px' }}>
                      <tbody>
                        <tr>
                          <th style={{ width: '35%' }}>
                            Company Data For Sales
                          </th>
                          <td style={{ width: '65%', verticalAlign: 'top' }}>
                            Alfreds Futterkiste
                          </td>
                        </tr>
                        <tr>
                          <th>Contact</th>
                          <td>Maria Anders</td>
                        </tr>
                        <tr>
                          <th>Country</th>
                          <td>Germany</td>
                        </tr>
                      </tbody>
                    </table>
                  ),
                },
                {
                  title: (
                    <Block display='flex' justifyContent='center'>
                      Sample Data
                    </Block>
                  ),
                  key: 'sample-data5',
                  content: (
                    <table id='sample-data5' style={{ fontSize: '12px' }}>
                      <tbody>
                        <tr>
                          <th style={{ width: '35%' }}>
                            Company Data For Sales
                          </th>
                          <td style={{ width: '65%', verticalAlign: 'top' }}>
                            Alfreds Futterkiste
                          </td>
                        </tr>
                        <tr>
                          <th>Contact</th>
                          <td>Maria Anders</td>
                        </tr>
                        <tr>
                          <th>Country</th>
                          <td>Germany</td>
                        </tr>
                      </tbody>
                    </table>
                  ),
                },
              ]}
            />
          </Block>
        </Block>
      </Tab>
      <Tab key='edge' title='Edge'>
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
      placeholder='Find a node'
      maxDropdownHeight='300px'
      type={TYPE.search}
      onChange={({ value }) => setValue(value)}
      value={value}
      overrides={{
        Root: {
          style: {
            ':focus': {
              outline: 'none',
            },
          },
        },
      }}
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
