/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isEmpty from 'lodash/isEmpty';
import * as LAYOUT from '../constants/layout-options';
import * as Graph from '../types/Graph';
import {
  NodeStyleType,
  EdgeStyleType,
} from '../containers/Graph/shape/constants';
import {
  combineProcessedData,
  deriveVisibleGraph,
  groupEdges,
  datatoTS,
  chartRange,
  filterDataByTime,
} from '../utils/graph-utils';

/**
 * Meant to be use on graph-slice state only
 * Update visible graph object by re-applying filtering and styling
 * Does not affect graphList / graphFlatten / graphGrouped
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
  state.graphVisible = deriveVisibleGraph(
    newFilteredData,
    state.styleOptions,
    accessors,
  );
};

/**
 * Meant to be use on graph-slice state only
 * Updates graphFlatten and graphGrouped onwards
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
    state.graphGrouped = groupEdges(graphData);
    state.graphFlatten = graphData;
    const tsData = datatoTS(state.graphFlatten, accessors.edgeTime);
    state.tsData = tsData;
    state.timeRange = isEmpty(tsData)
      ? []
      : chartRange([tsData[0][0], tsData[tsData.length - 1][0]]);
    // Update selectTimeRange to be timeRange always
    state.selectTimeRange = state.timeRange;
    // Filter graphFlatten based on selectTimeRange
    updateVisible(state, state.timeRange, accessors);
  } else {
    // Reset data state when all data is deleted
    state.graphGrouped = initialState.graphGrouped;
    state.graphFlatten = initialState.graphFlatten;
    state.graphVisible = initialState.graphVisible;
    state.tsData = initialState.tsData;
    state.timeRange = initialState.timeRange;
    state.selectTimeRange = initialState.selectTimeRange;
  }
};

export interface GraphState {
  accessors: Graph.Accessors;
  styleOptions: Graph.StyleOptions;
  defaultNodeStyle: NodeStyleType;
  defaultEdgeStyle: EdgeStyleType;
  graphList: Graph.GraphList;
  graphFlatten: Graph.GraphData;
  graphGrouped: { nodes: Graph.Node[]; edges: Graph.Edge[] };
  graphVisible: { nodes: Graph.Node[]; edges: Graph.Edge[] };
  tsData: Graph.TimeSeries;
  timeRange: Graph.TimeRange | [];
  selectTimeRange: Graph.TimeRange | [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailedSelection: any;
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
      name: 'dagre',
      options: { rankSep: 30 },
    },
    nodeStyle: {
      size: 'default',
    },
    edgeStyle: {
      width: 'fix',
    },
    resetView: true,
    groupEdges: true,
  },
  defaultNodeStyle: {},
  defaultEdgeStyle: {},
  graphList: [],
  graphFlatten: {
    nodes: [],
    edges: [],
    metadata: { fields: { nodes: [], edges: [] } },
  },
  graphGrouped: { nodes: [], edges: [] },
  graphVisible: { nodes: [], edges: [] },
  tsData: [],
  // Set a large interval to display the data on initialize regardless of resetView
  timeRange: [-2041571596000, 2041571596000],
  selectTimeRange: [-2041571596000, 2041571596000],
  detailedSelection: {
    type: null,
    data: null,
  },
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
      newGraphState.defaultNodeStyle = state.defaultNodeStyle;
      newGraphState.defaultEdgeStyle = state.defaultEdgeStyle;
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
    addQuery(state, action) {
      const queryResults = action.payload;
      state.graphList.push(queryResults);
    },
    changeOptions(state, action) {
      const { key, value, accessors } = action.payload;
      // const { edgeTime } = accessors;
      state.styleOptions[key] = value;
      updateVisible(state, state.selectTimeRange, accessors);
    },
    changeLayout(state, action) {
      const { layout, ...options } = action.payload;
      const defaultOptions = LAYOUT.OPTIONS.find((x) => x.name === layout);
      const newOptions = { ...defaultOptions.options, ...options };
      state.styleOptions.layout.name = layout;
      state.styleOptions.layout.options = newOptions;
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
    getDetails(state, action) {
      // TODO: There might be multiple matching hash! Need to match on trace
      const { type, hash } = action.payload;
      const data = state.graphFlatten.edges.filter((e) => e.id === hash)[0];
      state.detailedSelection.type = type;
      state.detailedSelection.data = data;
    },
    clearDetails(state) {
      state.detailedSelection.type = null;
      state.detailedSelection.data = null;
    },
    setAccessors(state, action) {
      state.accessors = action.payload;
    },
    setDefaultStyles(
      state,
      action: PayloadAction<{
        defaultNodeStyle: NodeStyleType;
        defaultEdgeStyle: EdgeStyleType;
      }>,
    ) {
      const { defaultNodeStyle, defaultEdgeStyle } = action.payload;
      state.defaultNodeStyle = defaultNodeStyle;
      state.defaultEdgeStyle = defaultEdgeStyle;
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
  processGraphResponse,
  setRange,
  timeRangeChange,
  getDetails,
  clearDetails,
  setAccessors,
  setDefaultStyles,
} = graph.actions;

export default graph.reducer;
