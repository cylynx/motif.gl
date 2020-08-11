/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice } from '@reduxjs/toolkit';
import isEmpty from 'lodash/isEmpty';
import * as LAYOUT from '../constants/layoutOptions';
import * as Graph from '../types/Graph';
import {
  combineProcessedData,
  deriveVisibleGraph,
  groupEdges,
  datatoTS,
  chartRange,
  filterDataByTime,
} from '../utils/graphUtils';

export interface GraphState {
  getFns: Graph.GetFns;
  styleOptions: Graph.StyleOptions;
  graphList: Graph.Data[];
  graphFlatten: { nodes: Graph.Node[]; edges: Graph.Edge[] };
  graphGrouped: { nodes: Graph.Node[]; edges: Graph.Edge[] };
  graphVisible: { nodes: Graph.Node[]; edges: Graph.Edge[] };
  tsData: boolean;
  timeRange: Graph.TimeRange | [];
  selectTimeRange: Graph.TimeRange | [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailedSelection: any;
}

const initialState: GraphState = {
  getFns: {
    getEdgeWidth: null,
    getEdgeTime: null,
  },
  styleOptions: {
    layout: {
      name: 'concentric',
      options: {},
    },
    nodeSize: 'default',
    edgeWidth: 'fix',
    resetView: true,
    groupEdges: true,
  },
  graphList: [],
  graphFlatten: { nodes: [], edges: [] },
  graphGrouped: { nodes: [], edges: [] },
  graphVisible: { nodes: [], edges: [] },
  tsData: false,
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
      newGraphState.getFns = state.getFns;
      return newGraphState;
    },
    addQuery(state, action) {
      const queryResults = action.payload;
      state.graphList.push(queryResults);
    },
    changeOptions(state, action) {
      const { key, value } = action.payload;
      const { getEdgeWidth, getEdgeTime } = state.getFns;
      state.styleOptions[key] = value;
      const newFilteredData = filterDataByTime(
        state.graphFlatten,
        state.selectTimeRange,
        getEdgeTime,
      );
      state.graphVisible = deriveVisibleGraph(
        newFilteredData,
        state.styleOptions,
        getEdgeWidth,
      );
    },
    changeLayout(state, action) {
      const newLayoutName = action.payload;
      if (newLayoutName === 'dagre') {
        state.styleOptions.layout = {
          name: newLayoutName,
          options: LAYOUT.DAGRE,
        };
      } else if (newLayoutName === 'circle') {
        state.styleOptions.layout = {
          name: newLayoutName,
          options: LAYOUT.CIRCLE,
        };
      } else if (newLayoutName === 'grid') {
        state.styleOptions.layout = {
          name: newLayoutName,
          options: LAYOUT.GRID,
        };
      } else if (newLayoutName === 'radial') {
        state.styleOptions.layout = {
          name: newLayoutName,
          options: LAYOUT.RADIAL,
        };
      } else {
        state.styleOptions.layout = {
          name: newLayoutName,
          options: {},
        };
      }
    },
    processGraphResponse(state, action) {
      const newData = action.payload;
      const { getEdgeWidth, getEdgeTime } = state.getFns;
      const modData = combineProcessedData(newData, state.graphFlatten);
      state.graphGrouped = groupEdges(modData);
      state.graphFlatten = modData;
      const tsData = datatoTS(state.graphFlatten, getEdgeTime);
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
        getEdgeTime,
      );
      state.graphVisible = deriveVisibleGraph(
        newFilteredData,
        state.styleOptions,
        getEdgeWidth,
      );
    },
    setRange(state, action) {
      const selectedTimeRange = action.payload;
      state.selectTimeRange = selectedTimeRange;
    },
    timeRangeChange(state, action) {
      const selectedTimeRange = action.payload;
      const { getEdgeWidth, getEdgeTime } = state.getFns;
      // Filter out all relevant edges and store from & to node id
      const newFilteredData = filterDataByTime(
        state.graphFlatten,
        selectedTimeRange,
        getEdgeTime,
      );
      state.graphVisible = deriveVisibleGraph(
        newFilteredData,
        state.styleOptions,
        getEdgeWidth,
      );
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
    setGetFns(state, action) {
      state.getFns = action.payload;
    },
  },
});

export { initialState };

export const {
  resetState,
  addQuery,
  changeOptions,
  changeLayout,
  processGraphResponse,
  setRange,
  timeRangeChange,
  getDetails,
  clearDetails,
  setGetFns,
} = graph.actions;

export default graph.reducer;
