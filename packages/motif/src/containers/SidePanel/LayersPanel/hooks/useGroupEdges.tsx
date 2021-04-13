import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import shortid from 'shortid';
import {
  DeleteGroupEdgeFieldPayload,
  FieldAndAggregation,
  GraphList,
  GraphSelectors,
  GraphSlices,
  GraphThunks,
  GroupEdgeFields,
  GroupEdgePayload,
  GroupEdges,
  UpdateGroupEdgeFieldPayload,
} from '../../../../redux/graph';
import { RootState } from '../../../../redux/investigate';

const useGroupEdges = (graphIndex: number) => {
  const dispatch = useDispatch();
  const graphList: GraphList = useSelector((state: RootState) =>
    GraphSelectors.getGraphList(state),
  );

  // obtain specific graph list group edges configurations
  const groupEdges: GroupEdges = useMemo(() => {
    return graphList[graphIndex].metadata.groupEdges;
  }, [graphIndex, graphList]);

  const performGroupEdges = () => {
    dispatch(GraphThunks.groupEdgesWithAggregation(graphIndex));
  };

  const computeEdgeSelection = () => {
    dispatch(GraphThunks.computeEdgeSelection());
  };

  /**
   * toggle group edge functionality with given value.
   * 1. enable - display 'all' as group type default.
   * 2. disable - delete group edge's type.
   *
   * @param value
   * @return {void}
   */
  const toggle = (value: boolean): void => {
    const params: GroupEdgePayload = {
      index: graphIndex,
      key: 'toggle',
      value,
    };

    dispatch(GraphSlices.setGroupEdgeOptions(params));

    if (value) {
      changeType('all');
      performGroupEdges();
      return;
    }

    resetState();
    performGroupEdges();
    computeEdgeSelection();
  };

  /**
   * change the type of group edges
   * 1. all - group all the edges
   * 2. types - group edges based on specific types.
   *
   * The field in aggregation should not possess the option selected by group by types.
   * By changing the group by types, we will verify whether aggregation fields
   * possess the selected types and delete the mentioned fields once it is found.
   *
   * @param value
   * @return {void}
   */
  const changeType = (value: string) => {
    const params: GroupEdgePayload = {
      index: graphIndex,
      key: 'type',
      value,
    };

    dispatch(GraphSlices.setGroupEdgeOptions(params));

    const groupEdgeFields: GroupEdgeFields = groupEdges.fields ?? {};
    const isFieldHasGroupByType = Object.entries(groupEdgeFields).find(
      (aggregateField) => {
        const [, fieldWithAggregation] = aggregateField;

        const { field } = fieldWithAggregation;
        return field === value;
      },
    );

    if (isFieldHasGroupByType !== undefined) {
      const [uniqueFieldId] = isFieldHasGroupByType;
      deleteFields(uniqueFieldId);
      return;
    }

    performGroupEdges();
    computeEdgeSelection();
  };

  const resetState = () => {
    dispatch(GraphSlices.resetGroupEdgeOptions(graphIndex));
    performGroupEdges();
    computeEdgeSelection();
  };

  const updateFields = (value: string, uniqueFieldId = shortid.generate()) => {
    dispatch(
      GraphSlices.updateGroupEdgeField({
        index: graphIndex,
        fieldId: uniqueFieldId,
        value,
      }),
    );
    performGroupEdges();
    computeEdgeSelection();
  };

  const updateAggregates = (
    value: FieldAndAggregation['aggregation'],
    uniqueFieldId: string,
  ) => {
    const params: UpdateGroupEdgeFieldPayload = {
      index: graphIndex,
      fieldId: uniqueFieldId,
      value,
    };
    dispatch(GraphSlices.updateGroupEdgeAggregate(params));
    performGroupEdges();
    computeEdgeSelection();
  };

  const deleteFields = (uniqueFieldId: string) => {
    const params: DeleteGroupEdgeFieldPayload = {
      graphIndex,
      fieldIndex: uniqueFieldId,
    };
    dispatch(GraphSlices.deleteGroupEdgeField(params));
    performGroupEdges();
    computeEdgeSelection();
  };

  return {
    groupEdges,
    toggle,
    changeType,
    updateFields,
    updateAggregates,
    deleteFields,
    computeEdgeSelection,
  };
};

export default useGroupEdges;
