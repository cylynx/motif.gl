import React, { Fragment } from 'react';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { getGraph } from '../../../redux';
import Header from '../Header';
import Accordion from '../../../components/Accordion';
import {
  SimpleForm,
  NestedForm,
  genNestedForm,
  genSimpleForm,
} from '../../../components/form';
import { changeLayout } from '../../../redux/graph-slice';
import * as Icon from '../../../components/Icons';
import {
  defaultLayoutForm,
  nodeSizeForm,
  nodeColorForm,
  nodeFontSizeForm,
} from './constants';

const OptionsPanel = () => {
  const dispatch = useDispatch();

  const styleOptions = useSelector((state) => getGraph(state).styleOptions);
  const { layout } = styleOptions;
  const layoutOptions = { id: layout.name, ...layout.options };
  const updateLayout = (data: any) => dispatch(changeLayout(data));

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
                  data={genNestedForm(
                    defaultLayoutForm,
                    layoutOptions,
                    updateLayout,
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
            content: <Fragment />,
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
