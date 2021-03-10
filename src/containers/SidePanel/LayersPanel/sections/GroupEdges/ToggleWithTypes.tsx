import React, { ChangeEvent, useMemo } from 'react';
import { Block } from 'baseui/block';
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from 'baseui/checkbox';
import { LabelXSmall } from 'baseui/typography';
import { Select, SIZE, OnChangeParams, Value, Option } from 'baseui/select';
import { GroupEdgeType } from '../../../../../redux/graph';

type ToggleWithTypesProps = {
  toggle: boolean;
  type: undefined | GroupEdgeType;
  onToggleChange: (e: ChangeEvent<HTMLInputElement>) => any;
  onTypeChange: (params: OnChangeParams) => any;
};

const TYPE_OPTIONS: Value = [
  {
    id: 'all',
    label: 'All',
  },
  {
    id: 'type',
    label: 'Type',
  },
];

const ByLabel = () =>
  useMemo(
    () => (
      <LabelXSmall
        width='30px'
        paddingTop='scale300'
        overrides={{
          Block: {
            style: { textTransform: 'capitalize', textAlign: 'center' },
          },
        }}
        marginTop='0'
        marginBottom='0'
      >
        by
      </LabelXSmall>
    ),
    [],
  );

const ToggleWithTypes = ({
  toggle,
  type,
  onTypeChange,
  onToggleChange,
}: ToggleWithTypesProps) => {
  const selectedTypes: Option = useMemo(() => {
    return TYPE_OPTIONS.find((option: Option) => option.id === type) ?? [];
  }, [type]);

  return (
    <>
      <Block paddingTop='3px' display='flex' flex='1'>
        <Checkbox
          checked={toggle}
          onChange={onToggleChange}
          checkmarkType={STYLE_TYPE.toggle_round}
          labelPlacement={LABEL_PLACEMENT.left}
          overrides={{
            Label: {
              style: ({ $theme }) => ({
                ...$theme.typography.LabelSmall,
                fontSize: $theme.sizing.scale500,
                paddingRight: $theme.sizing.scale0,
                paddingTop: $theme.sizing.scale100,
              }),
            },
          }}
        >
          Group Edge
        </Checkbox>
      </Block>

      {toggle && (
        <>
          <ByLabel />
          <Block display='flex' flex='1'>
            <Select
              size={SIZE.mini}
              searchable={false}
              clearable={false}
              options={TYPE_OPTIONS}
              value={[selectedTypes]}
              placeholder='Select color'
              onChange={onTypeChange}
            />
          </Block>
        </>
      )}
    </>
  );
};

export default ToggleWithTypes;
