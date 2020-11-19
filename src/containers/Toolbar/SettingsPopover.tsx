import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { Checkbox } from 'baseui/checkbox';
import { Block } from 'baseui/block';
import { TriGrid } from '../../components/ui';
import {
  changeOptions,
  changeLayout,
  changeNodeStyle,
  changeEdgeStyle,
} from '../../redux/graph-slice';
import { getGraph } from '../../redux';
import * as LAYOUT from '../../constants/layout-options';
import { NestedForm, genNestedForm } from '../../components/form';
import { nodeSizeForm, edgeWidthForm } from '../SidePanel/OptionsPanel';

const SettingsPopover = () => {
  const dispatch = useDispatch();
  const { nodeStyle, edgeStyle, resetView, groupEdges } = useSelector(
    (state) => getGraph(state).styleOptions,
  );
  const layoutName = useSelector(
    (state) => getGraph(state).styleOptions.layout.name,
  );
  const findID = (options: { label: string; id: string }[], id: string) =>
    options.find((x) => x.id === id);

  const onChangeOptions = (
    key: string,
    newValue: boolean | string | number,
  ) => {
    dispatch(changeOptions({ key, value: newValue }));
  };

  const updateNodeStyle = (data: any) => dispatch(changeNodeStyle(data));
  const updateEdgeStyle = (data: any) => dispatch(changeEdgeStyle(data));

  return (
    <Block width='300px' padding='10px'>
      <FormControl label='Graph Layout'>
        <Select
          options={LAYOUT.LAYOUT_NAMES}
          size='compact'
          clearable={false}
          value={[findID(LAYOUT.LAYOUT_NAMES, layoutName)]}
          onChange={(params) =>
            dispatch(
              changeLayout({ layout: { id: params.option.id as string } }),
            )
          }
        />
      </FormControl>
      <NestedForm
        data={genNestedForm(nodeSizeForm, nodeStyle, updateNodeStyle, {
          labelPosition: 'top',
        })}
      />
      <NestedForm
        data={genNestedForm(edgeWidthForm, edgeStyle, updateEdgeStyle, {
          labelPosition: 'top',
        })}
      />
      <TriGrid
        startComponent={
          <Checkbox
            checked={resetView}
            onChange={() => onChangeOptions('resetView', !resetView)}
            labelPlacement='right'
          >
            Reset View
          </Checkbox>
        }
        midComponent={
          <Checkbox
            checked={groupEdges}
            onChange={() => onChangeOptions('groupEdges', !groupEdges)}
            labelPlacement='right'
          >
            Group Edges
          </Checkbox>
        }
        span={[6, 6]}
      />
    </Block>
  );
};
export default SettingsPopover;
