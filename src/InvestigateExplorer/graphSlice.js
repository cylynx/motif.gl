/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice } from '@reduxjs/toolkit';

import {
  adjustNodeSize,
  styleEdge,
  styleGroupedEdge,
  combineEdges,
  replaceEdges,
  replaceData,
  datatoTS,
  chartRange,
  filterDataByTime,
} from './graphUtils';
import { removeDuplicates } from '../Utilities/utils';

const combineProcessedData = (newData, oldData) => {
  if (oldData) {
    const modData = { ...oldData };
    modData.nodes = removeDuplicates(
      [...newData.nodes, ...oldData.nodes],
      'id'
    );
    modData.edges = removeDuplicates(
      [...newData.edges, ...oldData.edges],
      'id'
    );
    return modData;
  }
  return newData;
};

const applyStyle = (data, defaultOptions) => {
  const { groupEdges, edgeWidth, nodeSize } = defaultOptions;
  if (groupEdges) {
    const styledEdges = styleGroupedEdge(data, edgeWidth);
    const styledNodes = adjustNodeSize(data, nodeSize);
    return { ...replaceData(data, styledNodes, styledEdges) };
  }
  const styledEdges = styleEdge(data, edgeWidth);
  const styledNodes = adjustNodeSize(data, nodeSize);
  return { ...replaceData(data, styledNodes, styledEdges) };
};

const groupEdges = data => {
  // combineEdges removed source and target properties of my edge initially
  const newEdges = combineEdges(data.edges);
  return { ...replaceEdges(data, newEdges) };
};

const initialState = {
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
      state.timeRange = chartRange([
        tsData[0][0],
        tsData[tsData.length - 1][0],
      ]);
      // Update selectTimeRange to be timeRange always
      state.selectTimeRange = state.timeRange;
      // Filter graphFlatten based on selectTimeRange
      const newFilteredData = filterDataByTime(
        state.graphFlatten,
        state.timeRange
      );
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
    updateGraph(state, action) {
      // Update graph specified by graphName with given newNodes and newEdges
      const { graphName, newNodes, newEdges } = action.payload;
      if (newNodes && newNodes.length !== 0) {
        state[graphName].nodes = newNodes;
      }
      if (newEdges && newEdges.length !== 0) {
        state[graphName].edges = newEdges;
      }
    },
    getDetails(state, action) {
      // TODO: There might be multiple matching hash! Need to match on trace
      const { type, hash } = action.payload;
      const data = state.graphFlatten.edges.filter(
        e => e.data.txn_hash === hash
      )[0];
      state.detailedSelection.type = type;
      state.detailedSelection.data = data;
    },
    clearDetails(state) {
      state.detailedSelection.type = null;
      state.detailedSelection.data = null;
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
  updateGraph,
  getDetails,
  clearDetails,
} = graph.actions;

export default graph.reducer;
