import React, { ChangeEvent, FC, useMemo } from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams, Value, Option } from 'baseui/select';
import { useSelector } from 'react-redux';
import AddAttributesButton from '../../components/AddAttributesButton';
import useGroupEdges from '../../hooks/useGroupEdges';
import ToggleWithTypes from './ToggleWithTypes';
import { FieldAndAggregation, GroupEdgeType } from '../../../../../redux/graph';
import AggregateFields from './AggregateFields';
import { RootState } from '../../../../../redux/investigate';
import { getGraphFieldsOptions } from '../../../../../redux/graph/selectors';

type GroupEdgesProps = { graphListIndex: number };
const GroupEdges: FC<GroupEdgesProps> = ({ graphListIndex }) => {
  const {
    groupEdges,
    toggle,
    changeType,
    updateFields,
    updateAggregates,
  } = useGroupEdges(graphListIndex);

  const { allEdgeFields } = useSelector((state: RootState) =>
    getGraphFieldsOptions(state),
  );

  const existingFields = useMemo(
    () =>
      Object.entries(groupEdges.fields ?? {}).map((data) => {
        const [, fieldAndAggregation] = data;
        return fieldAndAggregation.field;
      }),
    [groupEdges.fields],
  );

  const unselectedFields: Value = useMemo(() => {
    return allEdgeFields.filter(
      (edgeField: Option) => !existingFields.includes(edgeField.id as string),
    );
  }, [allEdgeFields, existingFields]);

  const isAllowAddFields: boolean = useMemo(() => {
    // does not contains any field
    const { fields } = groupEdges;
    if (!fields) return true;

    // values is empty do not allow to add field
    const isValuesEmpty = Object.entries(fields).some(
      ([, fieldAggregation]) => {
        const { aggregation } = fieldAggregation as FieldAndAggregation;
        return aggregation.length === 0;
      },
    );
    if (!isValuesEmpty) return true;

    // all the fields already selected, doesn't require to add fields.
    if (unselectedFields.length !== 0) return true;

    return false;
  }, [groupEdges.fields]);

  const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    toggle(e.target.checked);
  };

  const onTypeChange = (params: OnChangeParams) => {
    const [firstValue] = params.value as Value;
    const { id } = firstValue as Option;
    changeType(id as GroupEdgeType);
  };

  const onFieldChange = (params: OnChangeParams, uniqueFieldId: string) => {
    const [field] = params.value;
    updateFields(field.id as string, uniqueFieldId);
  };

  const onAggregateChange = (params: OnChangeParams, uniqueFieldId: string) => {
    if (params.value.length === 0) {
      updateAggregates([], uniqueFieldId);
      return;
    }

    const aggregations = params.value.map((opt: Option) => opt.id);

    updateAggregates(
      aggregations as FieldAndAggregation['aggregation'],
      uniqueFieldId,
    );
  };

  const addFields = () => {
    // there is no existing fields, create a field with edge fields.
    if (existingFields.length === 0) {
      const [firstOption] = allEdgeFields;
      updateFields(firstOption.id as string);
      return;
    }

    // create a field with remaining edge fields that prevent repeat with existing fields.
    const [firstOption] = unselectedFields;
    if (!firstOption) return;

    updateFields(firstOption.id as string);
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

      {groupEdges.type === 'type' && (
        <>
          <AggregateFields
            fields={groupEdges.fields}
            onFieldChange={onFieldChange}
            onAggregateChange={onAggregateChange}
          />

          {isAllowAddFields && (
            <Block marginTop='scale200'>
              <AddAttributesButton onClick={() => addFields()} />
            </Block>
          )}
        </>
      )}
    </Block>
  );
};

export default GroupEdges;
