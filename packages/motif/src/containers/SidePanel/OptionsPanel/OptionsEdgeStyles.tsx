import React, { Fragment, useMemo } from 'react';

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
  edgeWidthForm,
  edgePatternForm,
  edgeFontSizeForm,
  edgeLabelForm,
  edgeArrowForm,
} from './constants';

const OptionsEdgeStyles = () => {
  const dispatch = useDispatch();

  const edgeStyle = useSelector(
    (state) => GraphSelectors.getGraph(state).styleOptions.edgeStyle,
  );

  const { numericEdgeFields, edgeLabelFields } = useSelector((state) =>
    GraphSelectors.getGraphFieldsOptions(state),
  );

  const updateEdgeStyle = (data: any) =>
    dispatch(GraphSlices.changeEdgeStyle(data));

  const edgeWidthPropertyValue = useMemo(() => {
    if (edgeStyle.width.id === 'property') {
      return edgeStyle.width.variable;
    }

    if (numericEdgeFields.length > 0) {
      return numericEdgeFields[0].id;
    }

    return null;
  }, [numericEdgeFields, edgeStyle.width]);

  const edgeWidthFormData = genNestedForm(
    edgeWidthForm,
    edgeStyle,
    updateEdgeStyle,
    {
      'property[0].options': numericEdgeFields,
      'property[0].value': edgeWidthPropertyValue,
    },
  );

  return (
    <Accordion
      data-testid='OptionsEdgeStyles'
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
                data={edgeWidthFormData}
                key={`${edgeWidthFormData.id}-${edgeWidthFormData.value}`}
              />
              <SimpleForm
                data={genSimpleForm(edgeLabelForm, edgeStyle, updateEdgeStyle, {
                  options: edgeLabelFields,
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
