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
  edgeWidthForm,
  edgePatternForm,
  edgeFontSizeForm,
  edgeLabelForm,
  edgeArrowForm,
} from './constants';

const defaultLabelOptions = [{ id: 'none', label: 'None' }];

const OptionsEdgeStyles = () => {
  const dispatch = useDispatch();

  const edgeStyle = useSelector(
    (state) => GraphSelectors.getGraph(state).styleOptions.edgeStyle,
  );

  const graphFields = useSelector(
    (state) => GraphSelectors.getGraph(state).graphFlatten.metadata.fields,
  );

  let edgeLabelOptions = GraphUtils.getFieldNames(graphFields.edges).map(
    (x) => {
      return { id: x, label: x };
    },
  );

  edgeLabelOptions = [...defaultLabelOptions, ...edgeLabelOptions];

  const numericEdgeOptions =
    GraphUtils.getFieldNames(graphFields.edges, ['integer', 'real']).map(
      (x) => {
        return { id: x, label: x };
      },
    ) || [];

  const updateEdgeStyle = (data: any) =>
    dispatch(GraphSlices.changeEdgeStyle(data));
  return (
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
                data={genNestedForm(edgeWidthForm, edgeStyle, updateEdgeStyle, {
                  'property[0].options': numericEdgeOptions,
                  'property[0].value':
                    numericEdgeOptions.length > 0
                      ? numericEdgeOptions[0].id
                      : null,
                })}
              />
              <SimpleForm
                data={genSimpleForm(edgeLabelForm, edgeStyle, updateEdgeStyle, {
                  options: edgeLabelOptions,
                })}
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
                data={genSimpleForm(edgeArrowForm, edgeStyle, updateEdgeStyle)}
              />
            </Fragment>
          ),
          expanded: true,
        },
      ]}
    />
  );
};

export default OptionsEdgeStyles;
