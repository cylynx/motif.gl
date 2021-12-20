/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isUndefined from 'lodash/isUndefined';
import { Draft } from 'immer';
import * as LAYOUT from '../../constants/layout-options';
import { DARK_GREY } from '../../constants/colors';
import { generateDefaultColorMap } from '../../utils/style-utils/color-utils';
import * as T from './types';
import {
  DEFAULT_NODE_STYLE,
  EDGE_DEFAULT_COLOR,
} from '../../constants/graph-shapes';
import { groupEdgesForImportation } from './processors/group-edges';
import {
  combineGraphs,
  combineProcessedData,
  removeGraphDuplicates,
} from '../../utils/graph-utils/utils';

/**
 * Perform update on node and edge selections.
 *
 * @param state
 * @param data
 * @return {void}
 */
export const updateSelections = (
  state: Draft<T.GraphState>,
  data: T.GraphData,
): void => {
  const currentNodeFields = state.nodeSelection.map((x) => x.id);
  const currentEdgeFields = state.edgeSelection.map((x) => x.id);
  for (const field of data.metadata.fields.nodes) {
    if (!currentNodeFields.includes(field.name)) {
      state.nodeSelection.push({
        label: field.name,
        id: field.name,
        type: field.type,
        selected: false,
      });
    }
  }
  for (const field of data.metadata.fields.edges) {
    if (!currentEdgeFields.includes(field.name)) {
      state.edgeSelection.push({
        label: field.name,
        id: field.name,
        type: field.type,
        selected: false,
      });
    }
  }
};

/**
 * Meant to be use on graph-slice state only
 * Updates graphFlatten onwards
 *
 * @param {GraphState} state
 * @param {GraphData} graphData
 */
export const updateAll = (
  state: T.GraphState | Draft<T.GraphState>,
  graphData: T.GraphData,
) => {
  if (graphData) {
    state.graphFlatten = graphData;
  } else {
    // Reset data state when all data is deleted
    state.graphFlatten = initialState.graphFlatten;
    state.nodeSelection = initialState.nodeSelection;
    state.edgeSelection = initialState.edgeSelection;
    state.filterOptions = initialState.filterOptions;
    state.searchOptions = initialState.searchOptions;
  }
};

const initialState: T.GraphState = {
  accessors: {
    nodeID: 'id',
    edgeID: 'id',
    edgeSource: 'source',
    edgeTarget: 'target',
  },
  styleOptions: {
    layout: LAYOUT.CONCENTRIC_DEFAULT,
    nodeStyle: {
      color: {
        id: 'fixed',
        value: DEFAULT_NODE_STYLE.color,
      },
      size: {
        id: 'fixed',
        value: 20,
      },
    },
    edgeStyle: {
      width: {
        id: 'fixed',
        value: 1,
      },
    },
  },
  filterOptions: {},
  searchOptions: {
    activeTabs: 'nodes',
    nodeSearchCase: [],
    edgeSearchCase: [],
    pagination: {
      currentPage: 1,
      totalPage: 0,
      totalItems: 0,
    },
    results: {
      nodes: [],
      edges: [],
    },
  },
  graphList: [],
  graphFlatten: {
    nodes: [],
    edges: [],
    metadata: { fields: { nodes: [], edges: [] } },
  },
  nodeSelection: [{ label: 'id', id: 'id', type: 'string', selected: true }],
  edgeSelection: [
    { label: 'id', id: 'id', type: 'string', selected: true },
    { label: 'source', id: 'source', type: 'string', selected: true },
    { label: 'target', id: 'target', type: 'string', selected: true },
  ],
};

const graph = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    resetState(state) {
      const newGraphState = { ...initialState };
      // Only reset data state
      newGraphState.accessors = state.accessors;
      newGraphState.styleOptions = state.styleOptions;

      return newGraphState;
    },
    updateGraphList(
      state,
      action: PayloadAction<{ from: number; to: number }>,
    ) {
      const { from, to } = action.payload;
      state.graphList.splice(
        to < 0 ? state.graphList.length + to : to,
        0,
        state.graphList.splice(from, 1)[0],
      );
    },
    deleteGraphList(state, action: PayloadAction<number>) {
      const { graphList } = state;
      graphList.splice(action.payload, 1);

      const groupedEdgeGraphList = graphList
        .filter((graph) => {
          const { visible = true } = graph.metadata;
          return visible === true;
        })
        .map((graphData) => {
          const { groupEdges } = graphData.metadata;

          if (groupEdges.toggle) {
            const { graphData: groupedEdgeData } = groupEdgesForImportation(
              graphData,
              groupEdges,
            );
            return groupedEdgeData;
          }

          return graphData;
        });

      const mergedGraph = combineGraphs(groupedEdgeGraphList);
      const graphFlatten = removeGraphDuplicates(mergedGraph);

      updateAll(state, graphFlatten);

      // update node and edge selection with existing fields
      state.edgeSelection = state.edgeSelection.filter((f) =>
        ['id'].includes(f.id),
      );
      state.nodeSelection = state.nodeSelection.filter((f) =>
        ['id', 'source', 'target'].includes(f.id),
      );
    },
    changeVisibilityGraphList(
      state,
      action: PayloadAction<{ index: number; isVisible: boolean }>,
    ) {
      const { index, isVisible } = action.payload;
      const { graphList } = state;
      graphList[index].metadata.visible = isVisible;

      const groupedEdgeGraph = graphList
        .filter((graph) => {
          const { visible = true } = graph.metadata;
          return visible === true;
        })
        .map((graphData) => {
          const { groupEdges } = graphData.metadata;

          if (groupEdges.toggle) {
            const { graphData: groupedEdgeData } = groupEdgesForImportation(
              graphData,
              groupEdges,
            );
            return groupedEdgeData;
          }

          return graphData;
        });

      const mergedGraph = combineGraphs(groupedEdgeGraph);
      const graphFlatten = removeGraphDuplicates(mergedGraph);

      Object.assign(state, {
        graphFlatten,
      });
    },
    addQuery(state, action: PayloadAction<T.GraphData[]>) {
      state.graphList.push(...action.payload);
    },
    updateStyleOption(state, action: PayloadAction<T.StyleOptions>) {
      Object.assign(state.styleOptions, action.payload);
    },
    updateFilterOption(state, action: PayloadAction<T.FilterOptions>) {
      Object.assign(state.filterOptions, action.payload);
    },
    changeLayout(state, action: PayloadAction<T.LayoutParams>): void {
      const { id, ...options } = action.payload.layout;
      const defaultOptions = LAYOUT.OPTIONS.find((x) => x.type === id);
      state.styleOptions.layout = {
        type: id,
        ...defaultOptions,
        ...options,
      };
    },
    changeNodeStyle(
      state,
      action: PayloadAction<{
        [key: string]: any;
      }>,
    ) {
      Object.entries(action.payload).forEach(([key, value]) => {
        state.styleOptions.nodeStyle[key] = value;
        // Assign default color mapping for legend
        if (
          key === 'color' &&
          value.id === 'legend' &&
          isUndefined(value.mapping)
        ) {
          generateDefaultColorMap(
            state.graphFlatten.nodes,
            state.styleOptions.nodeStyle.color,
            DARK_GREY,
          );
        }
      });
    },
    changeNodeMappingColor(state, action: PayloadAction<[string, string]>) {
      const [attrKey, colorHex] = action.payload;

      const { nodeStyle } = state.styleOptions;
      const { mapping = undefined } = nodeStyle.color as T.ColorLegend;
      if (!mapping) return;
      if (attrKey === 'Others') {
        const maxSize = 8;
        const otherNodeKeys = Object.keys(mapping);
        const mappingLength = otherNodeKeys.length;

        const otherKeys = otherNodeKeys.slice(maxSize + 1, mappingLength);
        otherKeys.forEach((key) => {
          mapping[key] = colorHex;
        });

        return;
      }

      mapping[attrKey] = colorHex;
    },
    changeEdgeMappingColor(state, action: PayloadAction<[string, string]>) {
      const [attrKey, colorHex] = action.payload;

      const { edgeStyle } = state.styleOptions;
      const { mapping = undefined } = edgeStyle.color as T.ColorLegend;
      if (!mapping) return;

      mapping[attrKey] = colorHex;
    },
    changeEdgeStyle(
      state,
      action: PayloadAction<{
        [key: string]: any;
      }>,
    ) {
      Object.entries(action.payload).forEach(([key, value]) => {
        state.styleOptions.edgeStyle[key] = value;
        // Assign default color mapping for legend
        if (
          key === 'color' &&
          value.id === 'legend' &&
          isUndefined(value.mapping)
        ) {
          generateDefaultColorMap(
            state.graphFlatten.edges,
            state.styleOptions.edgeStyle.color,
            EDGE_DEFAULT_COLOR,
          );
        }
      });
    },
    processGraphResponse(
      state,
      action: PayloadAction<{
        data: T.GraphData;
        accessors: T.Accessors;
      }>,
    ) {
      const { data } = action.payload;
      const { graphFlatten } = state;

      const graphData = combineProcessedData(
        data as T.GraphData,
        graphFlatten as T.GraphData,
      );

      updateAll(state, graphData);
      updateSelections(state, graphData);
    },
    setAccessors(state, action: PayloadAction<T.Accessors>) {
      state.accessors = action.payload;
    },
    overrideStyles(state, action: PayloadAction<T.StyleOptions>) {
      state.styleOptions = { ...state.styleOptions, ...action.payload };
    },
    updateNodeSelection(
      state,
      action: PayloadAction<{ index: number; status: boolean }>,
    ) {
      const { index, status } = action.payload;
      state.nodeSelection[index].selected = status;
    },
    updateAllNodeSelection(state, action: PayloadAction<{ status: boolean }>) {
      const { status } = action.payload;
      state.nodeSelection.forEach((item) => {
        item.selected = status;
      });
    },
    updateEdgeSelection(
      state,
      action: PayloadAction<{ index: number; status: boolean }>,
    ) {
      const { index, status } = action.payload;
      state.edgeSelection[index].selected = status;
    },
    updateAllEdgeSelection(state, action: PayloadAction<{ status: boolean }>) {
      const { status } = action.payload;
      state.edgeSelection.forEach((item) => {
        item.selected = status;
      });
    },
    resetFilters(state) {
      state.filterOptions = {};
    },
    updateFilterAttributes(
      state,
      action: PayloadAction<{ key: string; criteria: T.FilterCriteria }>,
    ) {
      const { key, criteria } = action.payload;
      Object.assign(state.filterOptions, {
        [key]: criteria,
      });
    },
    removeFilterAttributes(state, action: PayloadAction<{ key: string }>) {
      const { key } = action.payload;
      const { [key]: value, ...res } = state.filterOptions;
      state.filterOptions = res;
    },
    updateSearchOptions(state, action: PayloadAction<T.SearchOptionPayload>) {
      const { key, value } = action.payload;
      Object.assign(state.searchOptions, {
        [key]: value,
      });
    },
    updateNodeResults(state, action: PayloadAction<T.SearchResultPayload>) {
      const { value } = action.payload;
      Object.assign(state.searchOptions.results, { nodes: value });
    },
    updateEdgeResults(state, action: PayloadAction<T.SearchResultPayload>) {
      const { value } = action.payload;
      Object.assign(state.searchOptions.results, { edges: value });
    },
    resetSearchOptions(state) {
      Object.assign(state.searchOptions, initialState.searchOptions);
    },
    setGroupEdgeOptions(state, action: PayloadAction<T.GroupEdgePayload>) {
      const { index, key, value } = action.payload;
      Object.assign(state.graphList[index].metadata.groupEdges, {
        [key]: value,
      });
    },
    resetGroupEdgeOptions(state, action: PayloadAction<number>) {
      const { availability } =
        state.graphList[action.payload].metadata.groupEdges;
      Object.assign(state.graphList[action.payload].metadata, {
        groupEdges: {
          toggle: false,
          availability,
        },
      });
    },
    updateGroupEdgeField(
      state,
      action: PayloadAction<T.UpdateGroupEdgeFieldPayload>,
    ) {
      const { index, fieldId, value } = action.payload;

      const groupEdgeFields =
        state.graphList[index].metadata.groupEdges.fields ?? {};

      const fieldAndAggregation: T.FieldAndAggregation = {
        field: value as string,
        aggregation: [],
      };

      Object.assign(groupEdgeFields, {
        [fieldId]: fieldAndAggregation,
      });

      Object.assign(state.graphList[index].metadata.groupEdges, {
        fields: groupEdgeFields,
      });
    },
    updateGroupEdgeAggregate(
      state,
      action: PayloadAction<T.UpdateGroupEdgeFieldPayload>,
    ) {
      const { index, fieldId, value } = action.payload;

      // retrieve the specific aggregation fields from graph list.
      const aggregationField =
        state.graphList[index].metadata.groupEdges.fields[fieldId];

      // assign the value into the aggregation fields
      Object.assign(aggregationField, { aggregation: value });

      // update specific aggreation fields in specific graph list
      Object.assign(state.graphList[index].metadata.groupEdges.fields, {
        [fieldId]: aggregationField,
      });
    },
    deleteGroupEdgeField(
      state,
      action: PayloadAction<T.DeleteGroupEdgeFieldPayload>,
    ) {
      const { graphIndex, fieldIndex } = action.payload;

      // remove specific fields from the group edge list.
      const { [fieldIndex]: removedValue, ...res } =
        state.graphList[graphIndex].metadata.groupEdges.fields;

      // assign the removed fields into the redux states
      Object.assign(state.graphList[graphIndex].metadata.groupEdges, {
        fields: res,
      });
    },
    updateGraphFlatten(state, action: PayloadAction<T.GraphData>) {
      Object.assign(state.graphFlatten, action.payload);
    },
    overwriteEdgeSelection(state, action: PayloadAction<T.Selection[]>) {
      Object.assign(state, {
        edgeSelection: action.payload,
      });
    },
    updateGroupEdgeIds(state, action: PayloadAction<T.UpdateGroupEdgeIds>) {
      const { graphIndex, groupEdgeIds } = action.payload;

      state.graphList[graphIndex].metadata.groupEdges.ids = groupEdgeIds;
    },
    updateLastGroupEdgeIds(state, action: PayloadAction<string[]>) {
      const lastGraphIndex = state.graphList.length - 1;

      if (lastGraphIndex <= -1) {
        return;
      }

      state.graphList[lastGraphIndex].metadata.groupEdges.ids = action.payload;
    },
    updateNodePosition(state, action: PayloadAction<T.NodePosParams[]>) {
      const modifiedNodes = state.graphFlatten.nodes.map(
        (node: Draft<T.Node>, index: number) => {
          const foundNode: T.NodePosParams | undefined = action.payload.find(
            (params: T.NodePosParams) => params.nodeId === node.id,
          );

          if (!foundNode) return node;

          const { x, y } = foundNode;
          const specificNode = state.graphFlatten.nodes[index];
          return {
            ...specificNode,
            x,
            y,
          };
        },
      );

      state.graphFlatten.nodes = modifiedNodes;
    },
  },
});

export { initialState };

export const {
  resetState,
  updateGraphList,
  deleteGraphList,
  changeVisibilityGraphList,
  addQuery,
  updateStyleOption,
  changeLayout,
  changeNodeStyle,
  changeEdgeStyle,
  processGraphResponse,
  setAccessors,
  overrideStyles,
  updateNodeSelection,
  updateAllNodeSelection,
  updateEdgeSelection,
  updateAllEdgeSelection,
  updateFilterAttributes,
  removeFilterAttributes,
  resetFilters,
  updateSearchOptions,
  resetSearchOptions,
  updateNodeResults,
  updateEdgeResults,
  setGroupEdgeOptions,
  resetGroupEdgeOptions,
  updateGroupEdgeField,
  updateGroupEdgeAggregate,
  deleteGroupEdgeField,
  updateGraphFlatten,
  updateGroupEdgeIds,
  updateLastGroupEdgeIds,
  overwriteEdgeSelection,
  updateNodePosition,
  updateFilterOption,
  changeNodeMappingColor,
  changeEdgeMappingColor,
} = graph.actions;

export default graph.reducer;
