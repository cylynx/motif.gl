/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isUndefined from 'lodash/isUndefined';
import * as LAYOUT from '../../constants/layout-options';
import { combineProcessedData } from './utils';
import { generateDefaultColorMap } from '../../utils/style-nodes';
import {
  Accessors,
  FilterCriteria,
  GraphState,
  StyleOptions,
  GraphData,
} from './types';

export const updateSelections = (state: GraphState, data: GraphData) => {
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
export const updateAll = (state: GraphState, graphData: GraphData) => {
  if (graphData) {
    state.graphFlatten = graphData;
  } else {
    // Reset data state when all data is deleted
    state.graphFlatten = initialState.graphFlatten;
    state.nodeSelection = initialState.nodeSelection;
    state.edgeSelection = initialState.edgeSelection;
    state.filterOptions = initialState.filterOptions;
  }
};

const initialState: GraphState = {
  accessors: {
    nodeID: 'id',
    edgeID: 'id',
    edgeSource: 'source',
    edgeTarget: 'target',
  },
  styleOptions: {
    layout: {
      name: 'concentric',
      options: {
        minNodeSpacing: 60,
      },
    },
    nodeStyle: {
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
      label: 'none',
    },
    resetView: true,
    groupEdges: false,
  },
  filterOptions: {},
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
      // Loop through graphList to generate new graphData
      let graphData;
      for (const data of graphList) {
        if (data?.metadata?.visible !== false) {
          graphData = combineProcessedData(data, graphData);
        }
      }
      updateAll(state, graphData);
    },
    changeVisibilityGraphList(
      state,
      action: PayloadAction<{ index: number; isVisible: boolean }>,
    ) {
      const { index, isVisible } = action.payload;
      const { graphList } = state;
      graphList[index].metadata.visible = isVisible;
      let graphData;
      for (const data of graphList) {
        if (data?.metadata?.visible !== false) {
          graphData = combineProcessedData(data, graphData);
        }
      }

      Object.assign(state, {
        graphFlatten: graphData ?? initialState.graphFlatten,
      });
    },
    addQuery(state, action: PayloadAction<GraphData>) {
      state.graphList.push(action.payload);
    },
    changeOptions(state, action: PayloadAction<{ key: string; value: any }>) {
      const { key, value } = action.payload;
      state.styleOptions[key] = value;
    },
    changeLayout(
      state,
      action: PayloadAction<{
        layout: {
          id: string;
          [key: string]: any;
        };
      }>,
    ) {
      const { id, ...options } = action.payload.layout;
      const defaultOptions = LAYOUT.OPTIONS.find((x) => x.name === id);
      const newOptions = { ...defaultOptions.options, ...options };
      // @ts-ignore
      state.styleOptions.layout.name = id;
      state.styleOptions.layout.options = newOptions;
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
          );
        }
      });
    },
    changeEdgeStyle(
      state,
      action: PayloadAction<{
        [key: string]: any;
      }>,
    ) {
      Object.entries(action.payload).forEach(([key, value]) => {
        state.styleOptions.edgeStyle[key] = value;
      });
    },
    processGraphResponse(
      state,
      action: PayloadAction<{
        data: GraphData;
        accessors: Accessors;
      }>,
    ) {
      const { data } = action.payload;
      const { graphFlatten } = state;
      const graphData = combineProcessedData(data, graphFlatten);
      updateAll(state, graphData);
      updateSelections(state, data);
    },
    setAccessors(state, action: PayloadAction<Accessors>) {
      state.accessors = action.payload;
    },
    overrideStyles(state, action: PayloadAction<StyleOptions>) {
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
      action: PayloadAction<{ key: string; criteria: FilterCriteria }>,
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
  },
});

export { initialState };

export const {
  resetState,
  updateGraphList,
  deleteGraphList,
  changeVisibilityGraphList,
  addQuery,
  changeOptions,
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
} = graph.actions;

export default graph.reducer;
