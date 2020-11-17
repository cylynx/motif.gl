/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import * as LAYOUT from '../constants/layout-options';
import * as Graph from '../containers/Graph/types';
import {
  combineProcessedData,
  deriveVisibleGraph,
  datatoTS,
  chartRange,
  filterDataByTime,
} from '../utils/graph-utils';

export const updateSelections = (state: GraphState, data: Graph.GraphData) => {
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
 * Update visible graph object by re-applying filtering and styling
 * Does not affect graphList / graphFlatten
 *
 * @param {GraphState} state
 * @param {(Graph.TimeRange | [])} timeRange
 * @param {Graph.Accessors} accessors
 */
export const updateVisible = (
  state: GraphState,
  timeRange: Graph.TimeRange | [],
  accessors: Graph.Accessors,
) => {
  const newFilteredData = filterDataByTime(
    state.graphFlatten,
    timeRange,
    accessors.edgeTime,
  );
  state.graphVisible = deriveVisibleGraph(newFilteredData, state.styleOptions);
};

/**
 * Meant to be use on graph-slice state only
 * Updates graphFlatten onwards
 *
 * @param {GraphState} state
 * @param {Graph.GraphData} graphData
 * @param {Graph.Accessors} accessors
 */
export const updateAll = (
  state: GraphState,
  graphData: Graph.GraphData,
  accessors: Graph.Accessors,
) => {
  if (graphData) {
    state.graphFlatten = graphData;
    const tsData = datatoTS(state.graphFlatten, accessors.edgeTime);
    state.tsData = tsData;
    state.timeRange = isEmpty(tsData)
      ? []
      : chartRange([tsData[0][0], tsData[tsData.length - 1][0]]);
    // Update selectTimeRange to be timeRange always
    state.selectTimeRange = state.timeRange;
    // Filter graphFlatten based on selectTimeRange
    const newFilteredData = filterDataByTime(
      state.graphFlatten,
      state.timeRange,
      accessors.edgeTime,
    );
    // Clone here to avoid messing up graphFlatten
    state.graphVisible = deriveVisibleGraph(
      cloneDeep(newFilteredData),
      state.styleOptions,
    );
  } else {
    // Reset data state when all data is deleted
    state.graphFlatten = initialState.graphFlatten;
    state.graphVisible = initialState.graphVisible;
    state.tsData = initialState.tsData;
    state.timeRange = initialState.timeRange;
    state.selectTimeRange = initialState.selectTimeRange;
    state.nodeSelection = initialState.nodeSelection;
    state.edgeSelection = initialState.edgeSelection;
  }
};

export type Selection = {
  label: string;
  id: string;
  type: string;
  selected: boolean;
};

export interface GraphState {
  accessors: Graph.Accessors;
  styleOptions: Graph.StyleOptions;
  graphList: Graph.GraphList;
  graphFlatten: Graph.GraphData;
  graphVisible: { nodes: Graph.Node[]; edges: Graph.Edge[] };
  tsData: Graph.TimeSeries;
  timeRange: Graph.TimeRange | [];
  selectTimeRange: Graph.TimeRange | [];
  nodeSelection: Selection[];
  edgeSelection: Selection[];
}

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
    groupEdges: true,
  },
  graphList: [],
  graphFlatten: {
    nodes: [],
    edges: [],
    metadata: { fields: { nodes: [], edges: [] } },
  },
  graphVisible: { nodes: [], edges: [] },
  tsData: [],
  // Set a large interval to display the data on initialize regardless of resetView
  timeRange: [-2041571596000, 2041571596000],
  selectTimeRange: [-2041571596000, 2041571596000],
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
      updateAll(state, graphData, state.accessors);
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
      updateAll(state, graphData, state.accessors);
    },
    addQuery(state, action: PayloadAction<Graph.GraphData>) {
      state.graphList.push(action.payload);
    },
    changeOptions(state, action: PayloadAction<{ key: string; value: any }>) {
      const { key, value } = action.payload;
      state.styleOptions[key] = value;
      updateVisible(state, state.selectTimeRange, state.accessors);
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
        key: any;
      }>,
    ) {
      const { selectTimeRange, accessors } = state;
      Object.entries(action.payload).forEach(([key, value]) => {
        state.styleOptions.nodeStyle[key] = value;
      });
      updateVisible(state, selectTimeRange, accessors);
    },
    changeEdgeStyle(
      state,
      action: PayloadAction<{
        key: any;
      }>,
    ) {
      const { selectTimeRange, accessors } = state;
      Object.entries(action.payload).forEach(([key, value]) => {
        state.styleOptions.edgeStyle[key] = value;
      });
      updateVisible(state, selectTimeRange, accessors);
    },
    processGraphResponse(
      state,
      action: PayloadAction<{
        data: Graph.GraphData;
        accessors: Graph.Accessors;
      }>,
    ) {
      const { data, accessors } = action.payload;
      const { graphFlatten } = state;
      const graphData = combineProcessedData(data, graphFlatten);
      updateAll(state, graphData, accessors);
      updateSelections(state, data);
    },
    setRange(state, action) {
      const selectedTimeRange = action.payload;
      state.selectTimeRange = selectedTimeRange;
    },
    timeRangeChange(state, action) {
      const { timeRange, accessors } = action.payload;
      // Filter out all relevant edges and store from & to node id
      updateVisible(state, timeRange, accessors);
    },
    setAccessors(state, action: PayloadAction<Graph.Accessors>) {
      state.accessors = action.payload;
    },
    overrideStyles(state, action: PayloadAction<Graph.StyleOptions>) {
      state.styleOptions = { ...state.styleOptions, ...action.payload };
    },
    updateNodeSelection(
      state,
      action: PayloadAction<{ index: number; status: boolean }>,
    ) {
      const { index, status } = action.payload;
      state.nodeSelection[index].selected = status;
    },
    updateEdgeSelection(
      state,
      action: PayloadAction<{ index: number; status: boolean }>,
    ) {
      const { index, status } = action.payload;
      state.edgeSelection[index].selected = status;
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
  setRange,
  timeRangeChange,
  setAccessors,
  overrideStyles,
  updateNodeSelection,
  updateEdgeSelection,
} = graph.actions;

export default graph.reducer;
