import React, { ChangeEvent, FC, useMemo } from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams, Value, Option } from 'baseui/select';
import { useSelector } from 'react-redux';
import AddAttributesButton from '../../components/AddAttributesButton';
import useGroupEdges from '../../hooks/useGroupEdges';
import GroupByFields from './GroupByFields';
import { FieldAndAggregation } from '../../../../../redux/graph';
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
    deleteFields,
  } = useGroupEdges(graphListIndex);

  const { allEdgeFields } = useSelector((state: RootState) =>
    getGraphFieldsOptions(state),
  );

  const edgeFields = useMemo(() => {
    return allEdgeFields.filter(
      (option: Option) =>
        !['id', 'source', 'target'].includes(option.id as string),
    );
  }, [allEdgeFields]);

  const existingFields = useMemo(
    () =>
      Object.entries(groupEdges.fields ?? {}).map((data) => {
        const [, fieldAndAggregation] = data;
        return fieldAndAggregation.field;
      }),
    [groupEdges.fields],
  );

  const unselectedFields: Value = useMemo(() => {
    return edgeFields.filter(
      (edgeField: Option) => !existingFields.includes(edgeField.id as string),
    );
  }, [edgeFields, existingFields]);

  const isAllowAddFields: boolean = useMemo(() => {
    // does not contains any field
    const { fields } = groupEdges;
    if (!fields) return true;

    // all the fields already selected, doesn't require to add fields.
    if (unselectedFields.length === 0) return false;

    // values is empty do not allow to add field
    const isValuesEmpty = Object.entries(fields).some(
      ([, fieldAggregation]) => {
        const { aggregation } = fieldAggregation as FieldAndAggregation;
        return aggregation.length === 0;
      },
    );
    if (!isValuesEmpty) return true;

    return false;
  }, [groupEdges.fields]);

  const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    toggle(e.target.checked);
  };

  const onTypeChange = (params: OnChangeParams) => {
    const [firstValue] = params.value as Value;
    const { id } = firstValue as Option;
    changeType(id as string);
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
      const [firstOption] = edgeFields;
      updateFields(firstOption.id as string);
      return;
    }

    // create a field with remaining edge fields that prevent repeat with existing fields.
    const [firstOption] = unselectedFields;
    if (!firstOption) return;

    updateFields(firstOption.id as string);
  };

  const removeField = (fieldIndex: string) => {
    deleteFields(fieldIndex);
  };

  return (
    <Block paddingLeft='scale300' paddingRight='scale300'>
      <GroupByFields
        toggle={groupEdges.toggle}
        type={groupEdges.type}
        edgeFields={edgeFields}
        onTypeChange={onTypeChange}
        onToggleChange={onCheckboxChange}
      />

      {groupEdges.toggle && (
        <>
          <AggregateFields
            edgeFields={edgeFields}
            fields={groupEdges.fields}
            onFieldChange={onFieldChange}
            onAggregateChange={onAggregateChange}
            onDeleteClick={removeField}
          />

          {isAllowAddFields && (
            <Block marginTop='scale100'>
              <AddAttributesButton onClick={() => addFields()} />
            </Block>
          )}
        </>
      )}
    </Block>
  );
};

export default GroupEdges;
