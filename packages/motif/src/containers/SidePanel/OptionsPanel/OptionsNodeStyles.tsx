import React, { Fragment } from 'react';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { GraphSlices, GraphSelectors } from '../../../redux/graph';
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

const OptionsNodeStyles = () => {
  const dispatch = useDispatch();

  const nodeStyle = useSelector(
    (state) => GraphSelectors.getGraph(state).styleOptions.nodeStyle,
  );

  const {
    allNodeFields,
    nodeLabelFields,
    numericNodeFields,
  } = useSelector((state) => GraphSelectors.getGraphFieldsOptions(state));

  const updateNodeStyle = (data: any) => {
    dispatch(GraphSlices.changeNodeStyle(data));
  };

  const nodeSizeFormData = genNestedForm(
    nodeSizeForm,
    nodeStyle,
    updateNodeStyle,
    {
      'property[0].options': numericNodeFields,
      'property[0].value':
        numericNodeFields.length > 0 ? numericNodeFields[0].id : null,
    },
  );

  const nodeColorFormData = genNestedForm(
    nodeColorForm,
    nodeStyle,
    updateNodeStyle,
    {
      'legend[0].options': allNodeFields,
    },
  );

  return (
    <Accordion
      data-testid='OptionsNodeStyles'
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
                  options: nodeLabelFields,
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
