import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl } from 'baseui/form-control';
import { OnChangeParams, Select } from 'baseui/select';
import { Block } from 'baseui/block';
import { GraphSlices, GraphSelectors } from '../../redux/graph';

import * as LAYOUT from '../../constants/layout-options';
import { NestedForm, genNestedForm } from '../../components/form';
import { nodeSizeForm, edgeWidthForm } from '../SidePanel/OptionsPanel';

const SelectFieldPopoverOverrides = {
  props: {
    overrides: {
      Body: {
        style: () => ({ zIndex: 2 }),
      },
    },
  },
};

const SettingsPopover = () => {
  const dispatch = useDispatch();
  const { nodeStyle, edgeStyle, layout } = useSelector((state) =>
    GraphSelectors.getStyleOptions(state),
  );

  const { numericNodeFields, numericEdgeFields } = useSelector((state) =>
    GraphSelectors.getGraphFieldsOptions(state),
  );

  const findID = (options: { label: string; id: string }[], id: string) =>
    options.find((x) => x.id === id);

  const updateNodeStyle = (data: any) =>
    dispatch(GraphSlices.changeNodeStyle(data));
  const updateEdgeStyle = (data: any) =>
    dispatch(GraphSlices.changeEdgeStyle(data));

  const onLayoutChange = (params: OnChangeParams): void => {
    dispatch(
      GraphSlices.changeLayout({
        layout: { id: params.option.id as string },
      }),
    );
  };

  return (
    <Block width='300px' paddingBottom='scale400'>
      <FormControl label='Graph Layout'>
        <Select
          id='SettingsPopover:GraphLayout'
          options={LAYOUT.LAYOUT_NAMES}
          size='compact'
          clearable={false}
          value={[findID(LAYOUT.LAYOUT_NAMES, layout.type)]}
          onChange={onLayoutChange}
          overrides={{
            Popover: SelectFieldPopoverOverrides,
          }}
        />
      </FormControl>
      <NestedForm
        data={genNestedForm(nodeSizeForm, nodeStyle, updateNodeStyle, {
          'property[0].options': numericNodeFields,
          'property[0].value':
            numericNodeFields.length > 0 ? numericNodeFields[0].id : null,
          labelPosition: 'top',
        })}
      />
      <NestedForm
        data={genNestedForm(edgeWidthForm, edgeStyle, updateEdgeStyle, {
          'property[0].options': numericEdgeFields,
          'property[0].value':
            numericEdgeFields.length > 0 ? numericEdgeFields[0].id : null,
          labelPosition: 'top',
        })}
      />
    </Block>
  );
};
export default SettingsPopover;
