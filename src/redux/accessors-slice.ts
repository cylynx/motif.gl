// @ts-nocheck
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
// immer wraps around redux-toolkit so we can 'directly' mutate state'
import { createSlice } from '@reduxjs/toolkit';
import * as Graph from '../types/Graph';

const initialState: Graph.AccessorFns = {
  getNodeID: (node) => node.id,
  getEdgeID: (edge) => edge.id,
  getEdgeSource: (edge) => edge.source,
  getEdgeTarget: (edge) => edge.target,
  getEdgeWidth: (edge) => edge.data.blk_ts_unix,
  getEdgeTime: (edge) => edge.data.blk_ts_unix,
};

const accessors = createSlice({
  name: 'accessors',
  initialState,
  reducers: {
    setAccessorFns(state, action) {
      state = action.payload;
    },
  },
});

export const { setAccessorFns } = accessors.actions;

export default accessors.reducer;
