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
  GroupEdgePayload,
  GroupEdges,
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
      dispatch(GraphThunks.groupEdgesWithAggregation(graphIndex));
      return;
    }

    resetState();
    dispatch(GraphThunks.groupEdgesWithAggregation(graphIndex));
  };

  /**
   * change the type of group edges
   * 1. all - group all the edges
   * 2. types - group edges based on specific types.
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
  };

  const resetState = () => {
    dispatch(GraphSlices.resetGroupEdgeOptions(graphIndex));
  };

  const updateFields = (value: string, uniqueFieldId = shortid.generate()) => {
    dispatch(
      GraphSlices.updateGroupEdgeField({
        index: graphIndex,
        fieldId: uniqueFieldId,
        value,
      }),
    );
  };

  const updateAggregates = (
    value: FieldAndAggregation['aggregation'],
    uniqueFieldId: string,
  ) => {
    dispatch(
      GraphSlices.updateGroupEdgeAggregate({
        index: graphIndex,
        fieldId: uniqueFieldId,
        value,
      }),
    );
  };

  const deleteFields = (uniqueFieldId: string) => {
    const params: DeleteGroupEdgeFieldPayload = {
      graphIndex,
      fieldIndex: uniqueFieldId,
    };
    dispatch(GraphSlices.deleteGroupEdgeField(params));
  };

  return {
    groupEdges,
    toggle,
    changeType,
    updateFields,
    updateAggregates,
    deleteFields,
  };
};

export default useGroupEdges;
