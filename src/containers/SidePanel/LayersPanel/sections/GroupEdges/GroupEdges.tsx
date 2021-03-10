import React, { ChangeEvent, FC, useState } from 'react';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import { OnChangeParams, Select, Value, SIZE, Option } from 'baseui/select';
import AddAttributesButton from '../../components/AddAttributesButton';
import useGroupEdges from '../../hooks/useGroupEdges';
import ToggleWithTypes from './ToggleWithTypes';
import { GroupEdgeType } from '../../../../../redux/graph';

type GroupEdgesProps = { graphListIndex: number };
const GroupEdges: FC<GroupEdgesProps> = ({ graphListIndex }) => {
  const { groupEdges, toggle, changeType } = useGroupEdges(graphListIndex);
  const [value, setValue] = useState<Value>([]);

  const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    toggle(e.target.checked);
  };

  const onSelectChange = (params: OnChangeParams) => {
    setValue(params.value);
  };

  const onTypeChange = (params: OnChangeParams) => {
    const [firstValue] = params.value as Value;
    const { id } = firstValue as Option;
    changeType(id as GroupEdgeType);
  };

  return (
    <Block paddingLeft='scale300' paddingRight='scale300'>
      <Block
        display='flex'
        justifyContent='space-between'
        marginTop='scale300'
        overrides={{
          Block: {
            style: ({ $theme }) => ({
              ...$theme.typography.ParagraphSmall,
            }),
          },
        }}
      >
        <ToggleWithTypes
          toggle={groupEdges.toggle}
          type={groupEdges.type}
          onTypeChange={onTypeChange}
          onToggleChange={onCheckboxChange}
        />
      </Block>

      <Block marginTop='scale500'>
        <Block
          display='flex'
          marginTop='scale200'
          justifyContent='space-between'
        >
          <Block>
            <LabelXSmall>Field</LabelXSmall>
          </Block>

          <Block width='20px' />

          <Block>
            <LabelXSmall>Aggregation</LabelXSmall>
          </Block>
        </Block>

        <Block
          display='flex'
          marginTop='scale200'
          justifyContent='space-between'
        >
          <Block display='flex' flex='1'>
            <Select
              size={SIZE.mini}
              clearable={false}
              options={[
                { label: 'AliceBlue', id: '#F0F8FF' },
                { label: 'AntiqueWhite', id: '#FAEBD7' },
                { label: 'Aqua', id: '#00FFFF' },
                { label: 'Aquamarine', id: '#7FFFD4' },
                { label: 'Azure', id: '#F0FFFF' },
                { label: 'Beige', id: '#F5F5DC' },
              ]}
              value={value}
              placeholder='Select color'
              onChange={onSelectChange}
            />
          </Block>

          <Block width='30px' />

          <Block display='flex' flex='1'>
            <Select
              size={SIZE.mini}
              clearable={false}
              options={[
                { label: 'AliceBlue', id: '#F0F8FF' },
                { label: 'AntiqueWhite', id: '#FAEBD7' },
                { label: 'Aqua', id: '#00FFFF' },
                { label: 'Aquamarine', id: '#7FFFD4' },
                { label: 'Azure', id: '#F0FFFF' },
                { label: 'Beige', id: '#F5F5DC' },
              ]}
              value={value}
              placeholder='Select color'
              onChange={onSelectChange}
            />
          </Block>
        </Block>

        <Block
          display='flex'
          marginTop='scale200'
          justifyContent='space-between'
        >
          <Block display='flex' flex='1'>
            <Select
              size={SIZE.mini}
              clearable={false}
              options={[
                { label: 'AliceBlue', id: '#F0F8FF' },
                { label: 'AntiqueWhite', id: '#FAEBD7' },
                { label: 'Aqua', id: '#00FFFF' },
                { label: 'Aquamarine', id: '#7FFFD4' },
                { label: 'Azure', id: '#F0FFFF' },
                { label: 'Beige', id: '#F5F5DC' },
              ]}
              value={value}
              placeholder='Select color'
              onChange={onSelectChange}
            />
          </Block>

          <Block width='30px' />

          <Block display='flex' flex='1'>
            <Select
              size={SIZE.mini}
              clearable={false}
              options={[
                { label: 'AliceBlue', id: '#F0F8FF' },
                { label: 'AntiqueWhite', id: '#FAEBD7' },
                { label: 'Aqua', id: '#00FFFF' },
                { label: 'Aquamarine', id: '#7FFFD4' },
                { label: 'Azure', id: '#F0FFFF' },
                { label: 'Beige', id: '#F5F5DC' },
              ]}
              value={value}
              placeholder='Select color'
              onChange={onSelectChange}
            />
          </Block>
        </Block>
      </Block>

      <Block marginTop='scale200'>
        <AddAttributesButton onClick={(e) => console.log(e)} />
      </Block>
    </Block>
  );
};

export default GroupEdges;
