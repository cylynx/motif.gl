import React, { Fragment } from 'react';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { getGraph } from '../../../redux';
import Header from '../Header';
import Accordion from '../../../components/Accordion';
import FormGenerator from '../../../components/FormGenerator';
import { changeLayout } from '../../../redux/graph-slice';
import * as Icon from '../../../components/Icons';
import { genLayoutForm } from './utils';

const OptionsPanel = () => {
  const dispatch = useDispatch();

  const styleOptions = useSelector((state) => getGraph(state).styleOptions);
  const { layout } = styleOptions;
  const layoutOptions = { id: layout.name, ...layout.options };
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
                <FormGenerator
                  data={genLayoutForm(layoutOptions, (data) =>
                    dispatch(changeLayout(data)),
                  )}
                />
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
