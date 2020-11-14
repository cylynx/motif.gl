import React, { Fragment } from 'react';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { getGraph, getUI } from '../../../redux';
import Header from '../Header';
import Accordion from '../../../components/Accordion';
import {
  SimpleForm,
  NestedForm,
  genNestedForm,
  genSimpleForm,
} from '../../../components/form';
import {
  changeLayout,
  changeNodeStyle,
  changeEdgeStyle,
} from '../../../redux/graph-slice';
import { getFieldNames } from '../../../utils/graph-utils';
import * as Icon from '../../../components/Icons';
import {
  layoutForm,
  nodeSizeForm,
  nodeColorForm,
  nodeFontSizeForm,
  edgeWidthForm,
  edgePatternForm,
  EdgeFontSizeForm,
} from './constants';

const OptionsPanel = () => {
  const dispatch = useDispatch();

  const styleOptions = useSelector((state) => getGraph(state).styleOptions);
  const graphFields = useSelector(
    (state) => getGraph(state).graphFlatten.metadata.fields,
  );
  const numericNodeOptions =
    getFieldNames(graphFields.nodes, ['integer', 'real']).map((x) => {
      return { id: x, label: x };
    }) || [];
  const numericEdgeOptions =
    getFieldNames(graphFields.edges, ['integer', 'real']).map((x) => {
      return { id: x, label: x };
    }) || [];

  const { layout, nodeStyle, edgeStyle } = styleOptions;
  const layoutOptions = { layout: { id: layout.name, ...layout.options } };

  const updateLayout = (data: any) => dispatch(changeLayout(data));
  const updateNodeStyle = (data: any) => dispatch(changeNodeStyle(data));
  const updateEdgeStyle = (data: any) => dispatch(changeEdgeStyle(data));

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
                  data={genNestedForm(
                    nodeSizeForm,
                    nodeStyle,
                    updateNodeStyle,
                    {
                      'property[0].options': numericNodeOptions,
                      'property[0].value':
                        numericNodeOptions.length > 0
                          ? numericNodeOptions[0].id
                          : null,
                    },
                  )}
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
                <NestedForm
                  data={genNestedForm(
                    edgeWidthForm,
                    edgeStyle,
                    updateEdgeStyle,
                    {
                      'property[0].options': numericEdgeOptions,
                      'property[0].value':
                        numericEdgeOptions.length > 0
                          ? numericEdgeOptions[0].id
                          : null,
                    },
                  )}
                />
                <SimpleForm
                  data={genSimpleForm(
                    edgePatternForm,
                    edgeStyle,
                    updateEdgeStyle,
                  )}
                />
                <SimpleForm
                  data={genSimpleForm(
                    EdgeFontSizeForm,
                    edgeStyle,
                    updateEdgeStyle,
                  )}
                />
              </Fragment>
            ),
            expanded: true,
          },
        ]}
      />
      <Block marginBottom='scale1000' />
    </Fragment>
  );
};

export default OptionsPanel;
