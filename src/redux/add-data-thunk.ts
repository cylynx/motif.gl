import some from 'lodash/some';
import isUndefined from 'lodash/isUndefined';
import { getGraph, getAccessors } from './combine-reducers';
import * as Graph from '../types/Graph';

import {
  fetchBegin,
  fetchError,
  fetchDone,
  setTimeLock,
  setBottomOpen,
} from './ui-slice';
import { addQuery, processGraphResponse } from './graph-slice';
import { processData } from '../utils/graph-utils';

const checkNewData = (
  graphList: Graph.GraphList,
  newData: Graph.GraphData,
): boolean => {
  if (isUndefined(newData.metadata)) {
    // eslint-disable-next-line no-param-reassign
    newData.metadata = {
      key: graphList.length,
    };
  }
  const graphListKeys = graphList.map((graph) => graph.metadata.key);
  return newData && !some(graphListKeys, (key) => key === newData.metadata.key);
};

const checkEdgeTime = (edgeTime: string): boolean => !isUndefined(edgeTime);

const processResponse = (
  dispatch: any,
  graphList: Graph.GraphList,
  accessors: Graph.Accessors,
  newData: Graph.GraphData,
) => {
  const { edgeTime, edgeWidth } = accessors;
  dispatch(fetchBegin());

  // Check edges for new data as it might just be repeated
  if (checkNewData(graphList, newData)) {
    dispatch(addQuery(newData));
    dispatch(processGraphResponse({ data: newData, accessors }));
    dispatch(fetchDone());
    // Check if TimeBar should be opened
    if (checkEdgeTime(edgeTime)) {
      dispatch(setBottomOpen(true));
    } else {
      dispatch(setTimeLock());
    }
  } else {
    dispatch(fetchDone());
    throw new Error('Data has already been imported');
  }
};

// Asynchronous forEach to ensure graph renders in a nice circle
const waitFor = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

async function asyncForEach(array: any[], callback: (item: any) => void) {
  for (const item of array) {
    // eslint-disable-next-line no-await-in-loop
    await callback(item);
  }
}

/**
 * Thunk to add data to graph
 * Input can either be a single GraphData object or an array of GraphData
 *
 * @param {(Graph.GraphData | Graph.GraphList)} data
 */
export const addData = (data: Graph.GraphData | Graph.GraphList) => (
  dispatch: any,
  getState: any,
) => {
  const { graphList } = getGraph(getState());
  const accessors = getAccessors(getState());
  const dataArray = Array.isArray(data) ? data : [data];
  asyncForEach(dataArray, async (graph) => {
    try {
      await waitFor(0);
      processResponse(
        dispatch,
        graphList,
        accessors,
        processData(graph, accessors),
      );
    } catch (err) {
      dispatch(fetchError(err));
    }
  });
};
