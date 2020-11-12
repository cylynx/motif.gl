import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { Checkbox } from 'baseui/checkbox';
import { Block } from 'baseui/block';
import { TriGrid } from '../../components/ui';
import * as Prop from '../../types/Prop';
import { changeOptions, changeLayout } from '../../redux/graph-slice';
import { getGraph, getAccessors } from '../../redux';

const nodeSizeOptions = [
  { label: 'Default', id: 'default' },
  { label: 'Number of Connections', id: 'degree' },
];

const edgeWidthOptions = [
  { label: 'Fixed', id: 'fix' },
  { label: 'Value', id: 'value' },
];

const layoutNames = [
  { label: 'Concentric', id: 'concentric' },
  { label: 'Force-Directed', id: 'force' },
  { label: 'Radial', id: 'radial' },
  { label: 'Grid', id: 'grid' },
  { label: 'Dagre', id: 'dagre' },
  { label: 'Circular', id: 'circle' },
];

const PopoverOption = () => {
  const dispatch = useDispatch();
  const accessors = useSelector((state) => getAccessors(state));
  const { nodeStyle, edgeStyle, resetView, groupEdges } = useSelector(
    (state) => getGraph(state).styleOptions,
  );
  const layoutName = useSelector(
    (state) => getGraph(state).styleOptions.layout.name,
  );
  const findID = (options: Prop.Layout[], id: string): Prop.Layout =>
    options.find((x) => x.id === id);

  const onChangeOptions = (
    key: string,
    newValue: boolean | string | number,
  ) => {
    dispatch(changeOptions({ key, value: newValue, accessors }));
  };

  return (
    <div style={{ width: '300px' }}>
      <Block padding='10px'>
        <FormControl label='Graph Layout'>
          <Select
            options={layoutNames}
            size='compact'
            clearable={false}
            value={[findID(layoutNames, layoutName)]}
            onChange={(params) =>
              dispatch(changeLayout({ layout: params.option.id }))
            }
          />
        </FormControl>
        <FormControl label='Node Size'>
          <Select
            options={nodeSizeOptions}
            size='compact'
            clearable={false}
            value={[findID(nodeSizeOptions, nodeStyle.size)]}
            onChange={(params) => onChangeOptions('nodeSize', params.option.id)}
          />
        </FormControl>
        <FormControl label='Edge Width'>
          <Select
            options={edgeWidthOptions}
            size='compact'
            clearable={false}
            value={[findID(edgeWidthOptions, edgeStyle.width)]}
            onChange={(params) =>
              onChangeOptions('edgeWidth', params.option.id)
            }
          />
        </FormControl>
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
    </div>
  );
};
export default PopoverOption;
