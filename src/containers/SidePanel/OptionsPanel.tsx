import React, { Fragment } from 'react';

import { Block } from 'baseui/block';
import { useSelector } from 'react-redux';
import { getGraph, getUI } from '../../redux';
import Header from './Header';
import Accordion from '../../components/Accordion';
import * as Icon from '../../components/Icons';

const OptionsPanel = () => {
  return (
    <Fragment>
      <Header />
      <Accordion
        items={[
          {
            title: (
              <Block display='flex' justifyContent='center'>
                <Icon.Network style={{ paddingRight: '8px' }} />
                Layout Options
              </Block>
            ),
            key: 'layout',
            content: (
              <Fragment>
                <Block>Layout Settings</Block>
              </Fragment>
            ),
            expanded: true,
          },
        ]}
      />
      <Block marginTop='scale800' />
      <Accordion
        items={[
          {
            title: (
              <Block display='flex' justifyContent='center'>
                <Icon.Node style={{ paddingRight: '8px' }} />
                Node Styles
              </Block>
            ),
            key: 'node styles',
            content: (
              <Fragment>
                <Block>Node Settings</Block>
              </Fragment>
            ),
            expanded: true,
          },
        ]}
      />
      <Block marginTop='scale800' />
      <Accordion
        items={[
          {
            title: (
              <Block display='flex' justifyContent='center'>
                <Icon.Edge style={{ paddingRight: '8px' }} />
                Edge Styles
              </Block>
            ),
            key: 'edge styles',
            content: (
              <Fragment>
                <Block>Edge Settings</Block>
              </Fragment>
            ),
            expanded: true,
          },
        ]}
      />
    </Fragment>
  );
};

export default OptionsPanel;
