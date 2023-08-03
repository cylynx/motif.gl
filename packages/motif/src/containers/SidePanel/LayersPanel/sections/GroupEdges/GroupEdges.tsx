import React, { FC, useMemo } from 'react';
import { Block } from 'baseui/block';
import { OnChangeParams, Value, Option } from 'baseui/select';
import { useSelector } from '../../../../../redux/hooks';
import AddAttributesButton from '../../components/AddAttributesButton';
import useGroupEdges from '../../hooks/useGroupEdges';
import GroupByFields from './GroupByFields';
import {
  Field,
  FieldAndAggregation,
  GraphList,
} from '../../../../../redux/graph';
import AggregateFields from './AggregateFields';
import { RootState } from '../../../../../redux/investigate';
import { getGraphList } from '../../../../../redux/graph/selectors';
import useSearchOption from '../../../SearchPanel/hooks/useSearchOption';

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

  const { resetSearchOptions } = useSearchOption();
  const graphList: GraphList = useSelector((state: RootState) =>
    getGraphList(state),
  );
  const { edges: allEdgeFields } = graphList[graphListIndex].metadata.fields;

  // this edge options are use by group by selections
  const groupByEdgeFields = useMemo(() => {
    return allEdgeFields
      .filter(
        (option: Field) =>
          !['id', 'source', 'target'].includes(option.name as string),
      )
      .map((option: Field) => {
        const { name, type, analyzerType } = option;
        return {
          id: name,
          label: name,
          type,
          analyzerType,
        };
      });
  }, [allEdgeFields]);

  // this edge options exclude the options from group by types because
  // it's redundant to perform aggregation on the unique fields.
  const aggregateEdgeFields: Option[] = useMemo(() => {
    return groupByEdgeFields.filter(
      (edgeField: Option) => edgeField.id !== (groupEdges.type ?? ''),
    );
  }, [groupByEdgeFields, groupEdges.type]);

  const existingFields = useMemo(
    () =>
      Object.entries(groupEdges.fields ?? {}).map((data) => {
        const [, fieldAndAggregation] = data;
        return fieldAndAggregation.field;
      }),
    [groupEdges.fields],
  );

  const unselectedFields: Value = useMemo(() => {
    return aggregateEdgeFields.filter(
      (edgeField: Option) => !existingFields.includes(edgeField.id as string),
    );
  }, [aggregateEdgeFields, existingFields]);

  /**
   * Determine whether user is allow to add fields with the following conditions:
   * 1. does not contain any fields.
   *
   * User is not allow to add fields with the following conditions:
   * 1. all the fields are selected.
   * 2. values is empty.
   *
   * @return {boolean}
   */
  const isAllowAddFields: boolean = useMemo(() => {
    const { fields } = groupEdges;
    if (!fields) return true;

    if (unselectedFields.length === 0) return false;

    const isValuesEmpty = Object.entries(fields).some(
      ([, fieldAggregation]) => {
        const { aggregation } = fieldAggregation as FieldAndAggregation;
        return aggregation.length === 0;
      },
    );
    if (!isValuesEmpty) return true;

    return false;
  }, [groupEdges.fields]);

  const onCheckboxChange = (isGroupEdge: boolean) => {
    toggle(isGroupEdge);
    resetSearchOptions();
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

  /**
   * 1. There is no existing fields, create a field with edge options.
   * 2. Create a field with remaining edge options that yet to be selected
   *    to prevent repeat with existing fields in UX.
   *
   * @return {void}
   */
  const addFields = (): void => {
    if (existingFields.length === 0) {
      const [firstOption] = aggregateEdgeFields;
      updateFields(firstOption.id as string);
      return;
    }

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
        disabled={!groupEdges.availability}
        toggle={groupEdges.toggle}
        type={groupEdges.type}
        edgeFields={groupByEdgeFields}
        onTypeChange={onTypeChange}
        onToggleChange={onCheckboxChange}
      />

      {groupEdges.toggle && (
        <>
          <AggregateFields
            edgeFields={aggregateEdgeFields}
            fields={groupEdges.fields}
            type={groupEdges.type}
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
