import React, { useMemo, FC } from 'react';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import { Select, SIZE, Option, OnChangeParams, Value } from 'baseui/select';
import { Theme } from 'baseui/theme';
import { colors } from 'baseui/tokens';
import { Button } from 'baseui/button';
import { GroupEdges } from '../../../../../redux/graph';
import * as Icon from '../../../../../components/Icons';
import {
  NUMERIC_AGGREGATIONS,
  STRING_AGGREGATIONS,
} from '../../../../../constants/widget-units';

const FieldLabels = () =>
  useMemo(
    () => (
      <Block marginTop='scale200'>
        <LabelXSmall>Field with Aggregations</LabelXSmall>
      </Block>
    ),
    [],
  );

type AggregateFieldsProps = {
  edgeFields: Value;
  fields: GroupEdges['fields'];
  type: GroupEdges['type'];
  onFieldChange: (params: OnChangeParams, uniqueFieldId: string) => any;
  onAggregateChange: (params: OnChangeParams, uniqueFieldId: string) => any;
  onDeleteClick: (uniqueFieldId: string) => any;
};
const AggregateFields: FC<AggregateFieldsProps> = ({
  edgeFields,
  type,
  fields = {},
  onFieldChange,
  onAggregateChange,
  onDeleteClick,
}) => {
  const determineAggregationOpt = (type: string): Value => {
    if (type === 'integer' || type === 'real') {
      return NUMERIC_AGGREGATIONS;
    }

    return STRING_AGGREGATIONS;
  };

  const fieldsWithAggregation = Object.entries(fields)
    .filter((data) => {
      const [, fieldAndAggregration] = data;
      const { field } = fieldAndAggregration;
      return field !== type;
    })
    .map((data, index) => {
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
          marginTop={index === 0 ? 'scale200' : 'scale600'}
          key={uniqueFieldId}
        >
          <Block display='flex'>
            <Select
              data-testid='aggregate-fields:field'
              size={SIZE.mini}
              searchable={false}
              clearable={false}
              escapeClearsValue={false}
              options={edgeFields}
              value={fieldValue}
              maxDropdownHeight='300px'
              overrides={{ Root: { style: { maxWidth: '243px' } } }}
              onChange={(params: OnChangeParams) =>
                onFieldChange(params, uniqueFieldId)
              }
            />

            <Block marginLeft='scale200'>
              <Button
                data-testid='aggregate-fields:delete'
                size='compact'
                kind='minimal'
                $as='div'
                onClick={() => onDeleteClick(uniqueFieldId)}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }: { $theme: Theme }) => ({
                      paddingTop: '7px',
                      paddingRight: $theme.sizing.scale300,
                      paddingBottom: $theme.sizing.scale300,
                      paddingLeft: $theme.sizing.scale300,
                      backgroundColor: $theme.colors.backgroundTertiary,
                      ':hover': {
                        backgroundColor: colors.red500,
                      },
                    }),
                  },
                }}
              >
                <Icon.Trash />
              </Button>
            </Block>
          </Block>

          <Block width='100%' marginTop='scale100'>
            <Select
              data-testid='aggregate-fields:aggregate'
              size={SIZE.mini}
              searchable={false}
              clearable={false}
              escapeClearsValue={false}
              multi
              options={aggregationOpt}
              value={aggregationValue}
              placeholder='Click to Select Aggregations...'
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
    <Block marginTop='scale600'>
      <FieldLabels />

      {fieldsWithAggregation}
    </Block>
  );
};

export default AggregateFields;
