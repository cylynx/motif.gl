import React, { Fragment } from 'react';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { GraphSlices, GraphSelectors, GraphUtils } from '../../../redux/graph';
import Accordion from '../../../components/Accordion';
import {
  NestedForm,
  genNestedForm,
  SimpleForm,
  genSimpleForm,
} from '../../../components/form';

import * as Icon from '../../../components/Icons';
import {
  nodeSizeForm,
  nodeColorForm,
  nodeFontSizeForm,
  nodeLabelForm,
} from './constants';

const defaultLabelOptions = [{ id: 'none', label: 'None' }];

const OptionsNodeStyles = () => {
  const dispatch = useDispatch();

  const nodeStyle = useSelector(
    (state) => GraphSelectors.getGraph(state).styleOptions.nodeStyle,
  );

  const graphFields = useSelector(
    (state) => GraphSelectors.getGraph(state).graphFlatten.metadata.fields,
  );

  const nodeOptions = GraphUtils.getFieldNames(graphFields.nodes).map((x) => {
    return { id: x, label: x };
  });

  const nodeLabelOptions = [...defaultLabelOptions, ...nodeOptions];

  const numericNodeOptions = GraphUtils.getFieldNames(graphFields.nodes, [
    'integer',
    'real',
  ]).map((x) => {
    return { id: x, label: x };
  });

  const updateNodeStyle = (data: any) => {
    dispatch(GraphSlices.changeNodeStyle(data));
  };

  const nodeSizeFormData = genNestedForm(
    nodeSizeForm,
    nodeStyle,
    updateNodeStyle,
    {
      'property[0].options': numericNodeOptions,
      'property[0].value':
        numericNodeOptions.length > 0 ? numericNodeOptions[0].id : null,
    },
  );

  const nodeColorFormData = genNestedForm(
    nodeColorForm,
    nodeStyle,
    updateNodeStyle,
    {
      'legend[0].options': nodeOptions,
    },
  );

  return (
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
                data={nodeSizeFormData}
                key={`${nodeSizeFormData.id}-${nodeSizeFormData.value}`}
              />
              <SimpleForm
                data={genSimpleForm(nodeLabelForm, nodeStyle, updateNodeStyle, {
                  options: nodeLabelOptions,
                })}
              />
              <NestedForm
                data={nodeColorFormData}
                key={`${nodeColorFormData.id}-${nodeColorFormData.value}`}
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
  );
};

export default OptionsNodeStyles;
