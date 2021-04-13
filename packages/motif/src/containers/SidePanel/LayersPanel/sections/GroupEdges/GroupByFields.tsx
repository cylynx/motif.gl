import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { Block } from 'baseui/block';
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from 'baseui/checkbox';
import { LabelSmall } from 'baseui/typography';
import { Select, SIZE, OnChangeParams, Option } from 'baseui/select';
import debounce from 'lodash/debounce';

type GroupByFieldsProps = {
  disabled: boolean;
  toggle: boolean;
  type: undefined | string;
  edgeFields: Option[];
  onToggleChange: (toggle: boolean) => any;
  onTypeChange: (params: OnChangeParams) => any;
};

const ByLabel = () =>
  useMemo(
    () => (
      <LabelSmall
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
      </LabelSmall>
    ),
    [],
  );

const GroupByFields = ({
  disabled,
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

  const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    onToggleChangeDebounce(e.target.checked);
  };

  // prevent user spam click on the checkbox and cause application freeze.
  const onToggleChangeDebounce = useCallback(
    debounce((toggle: boolean) => {
      onToggleChange(toggle);
    }, 250),
    [],
  );

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
      <Block display='flex' flex='1'>
        <Checkbox
          disabled={disabled}
          checked={toggle}
          onChange={onCheckboxChange}
          checkmarkType={STYLE_TYPE.toggle_round}
          labelPlacement={LABEL_PLACEMENT.left}
          overrides={{
            Label: {
              style: ({ $theme }) => ({
                ...$theme.typography.LabelSmall,
                // fontSize: $theme.sizing.scale500,
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
        <Block marginTop='scale100'>
          <Select
            data-testid='group-by-fields:select'
            size={SIZE.compact}
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
