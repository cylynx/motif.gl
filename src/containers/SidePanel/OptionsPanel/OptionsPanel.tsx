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
import { changeLayout, changeNodeStyle } from '../../../redux/graph-slice';
import * as Icon from '../../../components/Icons';
import {
  layoutForm,
  nodeSizeForm,
  nodeColorForm,
  nodeFontSizeForm,
} from './constants';

const OptionsPanel = () => {
  const dispatch = useDispatch();

  const styleOptions = useSelector((state) => getGraph(state).styleOptions);
  const { layout, nodeStyle } = styleOptions;
  const layoutOptions = { layout: { id: layout.name, ...layout.options } };
  const updateLayout = (data: any) => dispatch(changeLayout(data));
  const updateNodeStyle = (data: any) => dispatch(changeNodeStyle(data));

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
                  data={genNestedForm(layoutForm, layoutOptions, updateLayout)}
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
                <NestedForm
                  data={genNestedForm(nodeSizeForm, nodeStyle, updateNodeStyle)}
                />
                <SimpleForm
                  data={genSimpleForm(
                    nodeColorForm,
                    nodeStyle,
                    updateNodeStyle,
                  )}
                />
                <SimpleForm
                  data={genSimpleForm(
                    nodeFontSizeForm,
                    nodeStyle,
                    updateNodeStyle,
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
