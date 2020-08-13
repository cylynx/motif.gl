import some from 'lodash/some';
import isUndefined from 'lodash/isUndefined';
import { getGraph, getAccessors } from '../redux';
import * as Graph from '../types/Graph';

import {
  fetchBegin,
  fetchError,
  fetchDone,
  postMessage,
  setTimeLock,
  setBottomOpen,
  setScoreLock,
  setValueLock,
} from '../redux/ui-slice';
import { addQuery, processGraphResponse } from '../redux/graph-slice';
import { processData } from '../utils/graph-utils';

// API Methods
const checkMetaData = (metadata: Graph.Metadata): boolean => {
  if (metadata) {
    return metadata.search_size > metadata.retrieved_size;
  }
  return false;
};

const checkNewData = (
  graphList: Graph.Data[],
  newData: Graph.Data,
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

const checkEdgeTime = (edgeTime: string): boolean =>
  !isUndefined(edgeTime);
const checkEdgeScore = (edgeScore: string): boolean =>
  !isUndefined(edgeScore);
const checkEdgeValue = (edgeWidth: string): boolean =>
  !isUndefined(edgeWidth);

const processResponse = (
  dispatch: any,
  graphList: Graph.Data[],
  accessors: Graph.Accessors,
  newData: Graph.Data,
) => {
  dispatch(fetchBegin());
  const { metadata } = newData;
  const { edgeTime, edgeScore, edgeWidth } = accessors;
  if (checkMetaData(metadata)) {
    const message = `${metadata.retrieved_size} / ${metadata.search_size} of the most recent transactions retrieved.
        We plan to allow large imports and visualization in the full version.
        Feel free to reach out to timothy at timothy.lin@cylynx.io if you are interesting in retrieving the full results.`;
    dispatch(postMessage(message));
  }
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
    // Check if score-related UI should be displayed
    if (!checkEdgeScore(edgeScore)) {
      dispatch(setScoreLock());
    }
    // Check if value-related UI should be displayed
    if (!checkEdgeValue(edgeWidth)) {
      dispatch(setValueLock());
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

// One function to rule them all
// Thunk to dispatch our calls
export const addData = (data: Graph.Data | Graph.Data[]) => (
  dispatch: any,
  getState: any,
) => {
  const { graphList } = getGraph(getState());
  const accessors = getAccessors(getState());
  if (Array.isArray(data)) {
    asyncForEach(data, async (graph) => {
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
  } else {
    try {
      processResponse(
        dispatch,
        graphList,
        accessors,
        processData(data, accessors),
      );
    } catch (err) {
      dispatch(fetchError(err));
    }
  }
};
