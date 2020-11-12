import React, { Fragment } from 'react';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { getGraph } from '../../../redux';
import Header from '../Header';
import Accordion from '../../../components/Accordion';
import { SimpleForm, NestedForm } from '../../../components/form-generator';
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
                <NestedForm
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
                <SimpleForm
                  data={{
                    id: 'name',
                    label: 'Test Input',
                    value: 10,
                    type: 'input',
                    callback: (data) => console.log(data),
                  }}
                />
                <SimpleForm
                  data={{
                    id: 'name',
                    label: 'Test Slider',
                    value: [5, 10],
                    type: 'slider',
                    max: 20,
                    callback: (data) => console.log(data),
                  }}
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
