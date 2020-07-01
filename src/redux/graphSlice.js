/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice } from '@reduxjs/toolkit';
import isEmpty from 'lodash/isEmpty';
import {
  combineProcessedData,
  applyStyle,
  groupEdges,
  datatoTS,
  chartRange,
  filterDataByTime,
} from '../Utilities/graphUtils';

const initialState = {
  getFns: null,
  defaultOptions: {
    layout: {
      name: 'concentric',
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
    resetState() {
      return initialState;
    },
    addQuery(state, action) {
      const queryResults = action.payload;
      state.graphList.push(queryResults);
    },
    changeOptions(state, action) {
      const { key, value } = action.payload;
      const defaultOptions = state.defaultOptions;
      defaultOptions[key] = value;
      const newFilteredData = filterDataByTime(
        state.graphFlatten,
        state.selectTimeRange
      );
      state.graphVisible = defaultOptions.groupEdges
        ? applyStyle(groupEdges(newFilteredData), defaultOptions)
        : applyStyle(newFilteredData, defaultOptions);
    },
    changeLayout(state, action) {
      const newLayoutName = action.payload;
      if (newLayoutName === 'dagre') {
        state.defaultOptions.layout = {
          name: newLayoutName,
          options: {
            rankSep: 10,
          },
        };
      } else if (newLayoutName === 'circle') {
        state.defaultOptions.layout = {
          name: newLayoutName,
          options: {
            r: 150,
          },
        };
      } else if (newLayoutName === 'grid') {
        state.defaultOptions.layout = {
          name: newLayoutName,
          options: {
            nodeSep: 45,
          },
        };
      } else if (newLayoutName === 'radial') {
        state.defaultOptions.layout = {
          name: newLayoutName,
          options: {
            unitRadius: 200,
          },
        };
      } else {
        state.defaultOptions.layout = {
          name: newLayoutName,
        };
      }
    },
    processGraphResponse(state, action) {
      const newData = action.payload;
      const modData = combineProcessedData(newData, state.graphFlatten);
      state.graphGrouped = groupEdges(modData);
      state.graphFlatten = modData;
      const tsData = datatoTS(state.graphFlatten);
      state.tsData = tsData;
      state.timeRange = isEmpty(tsData)
        ? []
        : chartRange([tsData[0][0], tsData[tsData.length - 1][0]]);
      // Update selectTimeRange to be timeRange always
      state.selectTimeRange = state.timeRange;
      // Filter graphFlatten based on selectTimeRange
      const newFilteredData = isEmpty(tsData)
        ? state.graphFlatten
        : filterDataByTime(state.graphFlatten, state.timeRange);
      const defaultOptions = state.defaultOptions;
      state.graphVisible = defaultOptions.groupEdges
        ? applyStyle(groupEdges(newFilteredData), defaultOptions)
        : applyStyle(newFilteredData, defaultOptions);
    },
    setRange(state, action) {
      const selectedTimeRange = action.payload;
      state.selectTimeRange = selectedTimeRange;
    },
    timeRangeChange(state, action) {
      const selectedTimeRange = action.payload;
      const defaultOptions = state.defaultOptions;
      // Filter out all relevant edges and store from & to node id
      const newFilteredData = filterDataByTime(
        state.graphFlatten,
        selectedTimeRange
      );
      state.graphVisible = state.defaultOptions.groupEdges
        ? applyStyle(groupEdges(newFilteredData), defaultOptions)
        : applyStyle(newFilteredData, defaultOptions);
      state.selectTimeRange = selectedTimeRange;
    },
    getDetails(state, action) {
      // TODO: There might be multiple matching hash! Need to match on trace
      const { type, hash } = action.payload;
      const data = state.graphFlatten.edges.filter(e => e.id === hash)[0];
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
