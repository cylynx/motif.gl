import React, { FormEvent, useState } from 'react';
import { Block } from 'baseui/block';
import { Checkbox, STYLE_TYPE, LABEL_PLACEMENT } from 'baseui/checkbox';
import { LabelXSmall } from 'baseui/typography';
import { OnChangeParams, Select, Value, SIZE } from 'baseui/select';

const GroupEdges = () => {
  const [groupEdge, setGroupEdge] = useState(false);
  const [value, setValue] = useState<Value>([]);

  const onCheckboxChange = (e: FormEvent<HTMLInputElement>) => {
    setGroupEdge(e.currentTarget.checked);
  };

  const onSelectChange = (params: OnChangeParams) => {
    setValue(params.value);
  };

  return (
    <Block
      display='flex'
      justifyContent='space-between'
      marginTop='scale500'
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            ...$theme.typography.ParagraphSmall,
          }),
        },
      }}
    >
      <Block paddingTop='scale100'>
        <Checkbox
          checked={groupEdge}
          onChange={onCheckboxChange}
          checkmarkType={STYLE_TYPE.toggle_round}
          labelPlacement={LABEL_PLACEMENT.left}
          overrides={{
            Label: {
              style: ({ $theme }) => ({
                ...$theme.typography.ParagraphSmall,
                fontSize: $theme.sizing.scale500,
                paddingRight: $theme.sizing.scale0,
                paddingTop: $theme.sizing.scale0,
              }),
            },
          }}
        >
          Group Edge
        </Checkbox>
      </Block>

      <LabelXSmall
        width='20px'
        paddingTop='scale300'
        overrides={{ Block: { style: { textTransform: 'capitalize' } } }}
        marginTop='0'
        marginBottom='0'
      >
        by
      </LabelXSmall>

      <Block>
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
  );
};

export default GroupEdges;
