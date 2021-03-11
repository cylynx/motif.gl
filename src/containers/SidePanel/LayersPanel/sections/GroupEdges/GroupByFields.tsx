import React, { ChangeEvent, useMemo } from 'react';
import { Block } from 'baseui/block';
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from 'baseui/checkbox';
import { LabelXSmall } from 'baseui/typography';
import { Select, SIZE, OnChangeParams, Value, Option } from 'baseui/select';

type GroupByFieldsProps = {
  toggle: boolean;
  type: undefined | string;
  edgeFields: Option[];
  onToggleChange: (e: ChangeEvent<HTMLInputElement>) => any;
  onTypeChange: (params: OnChangeParams) => any;
};

const ByLabel = () =>
  useMemo(
    () => (
      <LabelXSmall
        width='30px'
        paddingTop='5px'
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

const GroupByFields = ({
  toggle,
  type,
  edgeFields,
  onTypeChange,
  onToggleChange,
}: GroupByFieldsProps) => {
  const groupEdgeFields: Option[] = useMemo(() => {
    const ALL_FIELDS: Option = {
      id: 'all',
      label: '-',
    };
    return [ALL_FIELDS, ...edgeFields];
  }, [edgeFields]);

  const selectedTypes: Option = useMemo(() => {
    return groupEdgeFields.find((option: Option) => option.id === type) ?? [];
  }, [type]);

  return (
    <Block
      overrides={{
        Block: {
          style: ({ $theme }) => ({
            ...$theme.typography.ParagraphSmall,
          }),
        },
      }}
    >
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

        {toggle && <ByLabel />}
      </Block>

      {toggle && (
        <Block marginTop='scale200'>
          <Select
            size={SIZE.mini}
            searchable={false}
            clearable={false}
            maxDropdownHeight='300px'
            options={groupEdgeFields}
            value={[selectedTypes]}
            onChange={onTypeChange}
          />
        </Block>
      )}
    </Block>
  );
};

export default GroupByFields;
