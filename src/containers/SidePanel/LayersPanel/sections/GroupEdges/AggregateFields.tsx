import React, { useMemo, FC } from 'react';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import { Select, SIZE, Option, OnChangeParams, Value } from 'baseui/select';
import { GroupEdges } from '../../../../../redux/graph';

const NUMERIC_AGGREGATIONS: Value = [
  {
    id: 'min',
    label: 'Min',
  },
  {
    id: 'max',
    label: 'Max',
  },
  {
    id: 'average',
    label: 'Average',
  },
  {
    id: 'count',
    label: 'Sum',
  },
];

const STRING_AGGREGATIONS: Value = [
  {
    id: 'first',
    label: 'First',
  },
  {
    id: 'last',
    label: 'Last',
  },
  {
    id: 'most_frequent',
    label: 'Most Frequent',
  },
];

const FieldLabels = () =>
  useMemo(
    () => (
      <Block display='flex' marginTop='scale200' justifyContent='space-between'>
        <Block>
          <LabelXSmall>Field</LabelXSmall>
        </Block>

        <Block width='20px' />

        <Block>
          <LabelXSmall>Aggregation</LabelXSmall>
        </Block>
      </Block>
    ),
    [],
  );

type AggregateFieldsProps = {
  edgeFields: Value;
  fields: GroupEdges['fields'];
  onFieldChange: (params: OnChangeParams, uniqueFieldId: string) => any;
  onAggregateChange: (params: OnChangeParams, uniqueFieldId: string) => any;
};
const AggregateFields: FC<AggregateFieldsProps> = ({
  edgeFields,
  fields = {},
  onFieldChange,
  onAggregateChange,
}) => {
  const determineAggregationOpt = (type: string): Value => {
    if (type === 'integer' || type === 'real') {
      return NUMERIC_AGGREGATIONS;
    }

    return STRING_AGGREGATIONS;
  };

  const fieldsWithAggregation = Object.entries(fields).map((data) => {
    const [uniqueFieldId, fieldAndAggregration] = data;
    const { field, aggregation } = fieldAndAggregration;

    const fieldValue: Value = edgeFields.filter(
      (edgeField: Option) => edgeField.id === field,
    );

    const { type: fieldType } = fieldValue[0];
    const aggregationOpt: Value = determineAggregationOpt(fieldType);

    const aggregationValue: Value = aggregationOpt.filter((opt: Option) => {
      const { id } = opt;
      return aggregation.includes(id as never);
    });

    return (
      <Block
        display='flex'
        marginTop='scale200'
        justifyContent='space-between'
        key={uniqueFieldId}
      >
        <Block width='100%'>
          <Select
            size={SIZE.mini}
            searchable={false}
            clearable={false}
            escapeClearsValue={false}
            options={edgeFields}
            value={fieldValue}
            maxDropdownHeight='300px'
            onChange={(params: OnChangeParams) =>
              onFieldChange(params, uniqueFieldId)
            }
          />
        </Block>

        <Block width='30px' />

        <Block width='100%'>
          <Select
            size={SIZE.mini}
            searchable={false}
            clearable={false}
            escapeClearsValue={false}
            multi
            options={aggregationOpt}
            value={aggregationValue}
            maxDropdownHeight='300px'
            onChange={(params: OnChangeParams) =>
              onAggregateChange(params, uniqueFieldId)
            }
          />
        </Block>
      </Block>
    );
  });

  return (
    <Block marginTop='scale500'>
      <FieldLabels />

      {fieldsWithAggregation}
    </Block>
  );
};

export default AggregateFields;
