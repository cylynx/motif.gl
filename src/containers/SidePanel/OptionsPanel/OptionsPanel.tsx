import React, { Fragment } from 'react';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { GraphSlices, GraphSelectors } from '../../../redux/graph';
import Header from '../Header';
import Accordion from '../../../components/Accordion';
import {
  SimpleForm,
  NestedForm,
  genNestedForm,
  genSimpleForm,
} from '../../../components/form';

import { getFieldNames } from '../../../utils/graph-utils';
import * as Icon from '../../../components/Icons';
import {
  layoutForm,
  nodeSizeForm,
  nodeColorForm,
  nodeFontSizeForm,
  nodeLabelForm,
  edgeWidthForm,
  edgePatternForm,
  edgeFontSizeForm,
  edgeLabelForm,
  edgeArrowForm,
} from './constants';

const defaultLabelOptions = [
  { id: 'id', label: 'id' },
  { id: 'none', label: 'None' },
];

const OptionsPanel = () => {
  const dispatch = useDispatch();

  const styleOptions = useSelector(
    (state) => GraphSelectors.getGraph(state).styleOptions,
  );
  const graphFields = useSelector(
    (state) => GraphSelectors.getGraph(state).graphFlatten.metadata.fields,
  );

  const nodeOptions = getFieldNames(graphFields.nodes).map((x) => {
    return { id: x, label: x };
  });

  const nodeLabelOptions = [...defaultLabelOptions, ...nodeOptions];

  const numericNodeOptions = getFieldNames(graphFields.nodes, [
    'integer',
    'real',
  ]).map((x) => {
    return { id: x, label: x };
  });

  let edgeLabelOptions = getFieldNames(graphFields.edges).map((x) => {
    return { id: x, label: x };
  });

  edgeLabelOptions = [...defaultLabelOptions, ...edgeLabelOptions];

  const numericEdgeOptions =
    getFieldNames(graphFields.edges, ['integer', 'real']).map((x) => {
      return { id: x, label: x };
    }) || [];

  const { layout, nodeStyle, edgeStyle } = styleOptions;
  const layoutOptions = { layout: { id: layout.name, ...layout.options } };

  const updateLayout = (data: any) => dispatch(GraphSlices.changeLayout(data));
  const updateNodeStyle = (data: any) =>
    dispatch(GraphSlices.changeNodeStyle(data));
  const updateEdgeStyle = (data: any) =>
    dispatch(GraphSlices.changeEdgeStyle(data));

  return (
    <Fragment>
      <Header />
      <Accordion
        data-testid='options-panel:layout-options'
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
        data-testid='options-panel:node-styles'
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
                    nodeLabelForm,
                    nodeStyle,
                    updateNodeStyle,
                    { options: nodeLabelOptions },
                  )}
                />
                <NestedForm
                  data={genNestedForm(
                    nodeColorForm,
                    nodeStyle,
                    updateNodeStyle,
                    { 'legend[0].options': nodeOptions },
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
        data-testid='options-panel:edge-styles'
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
                    edgeLabelForm,
                    edgeStyle,
                    updateEdgeStyle,
                    { options: edgeLabelOptions },
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
                    edgeFontSizeForm,
                    edgeStyle,
                    updateEdgeStyle,
                  )}
                />
                <SimpleForm
                  data={genSimpleForm(
                    edgeArrowForm,
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
