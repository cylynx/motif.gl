import some from 'lodash/some';
import isUndefined from 'lodash/isUndefined';
import { getGraph } from '../redux/accessors';

import {
  fetchBegin,
  fetchError,
  fetchDone,
  postMessage,
  setTimeLock,
  setBottomOpen,
  setScoreLock,
  setValueLock,
} from '../redux/uiSlice';
import { addQuery, processGraphResponse } from '../redux/graphSlice';
import { processData } from '../utils/graphUtils';

// API Methods
const checkMetaData = metadata => {
  if (metadata) {
    return metadata.search_size > metadata.retrieved_size;
  }
  return false;
};

const checkNewData = (graphList, newData) => {
  if (isUndefined(newData.metadata)) {
    // eslint-disable-next-line no-param-reassign
    newData.metadata = {
      key: graphList.length,
    };
  }
  const graphListKeys = graphList.map(graph => graph.metadata.key);
  return newData && !some(graphListKeys, key => key === newData.metadata.key);
};

const checkEdgeTime = getEdgeTime => !isUndefined(getEdgeTime);
const checkEdgeScore = getEdgeScore => !isUndefined(getEdgeScore);
const checkEdgeValue = getEdgeValue => !isUndefined(getEdgeValue);

const processResponse = (dispatch, graphList, getFns, newData) => {
  dispatch(fetchBegin());
  const { metadata } = newData;
  const { getEdgeTime, getEdgeScore, getEdgeValue } = getFns;
  if (checkMetaData(metadata)) {
    const message = `${metadata.retrieved_size} / ${metadata.search_size} of the most recent transactions retrieved.
        We plan to allow large imports and visualization in the full version.
        Feel free to reach out to timothy at timothy.lin@cylynx.io if you are interesting in retrieving the full results.`;
    dispatch(postMessage(message));
  }
  // Check edges for new data as it might just be repeated
  if (checkNewData(graphList, newData)) {
    dispatch(addQuery(newData));
    dispatch(processGraphResponse(newData));
    dispatch(fetchDone());
    // Check if TimeBar should be opened
    if (checkEdgeTime(getEdgeTime)) {
      dispatch(setBottomOpen(true));
    } else {
      dispatch(setTimeLock());
    }
    // Check if score-related UI should be displayed
    if (!checkEdgeScore(getEdgeScore)) {
      dispatch(setScoreLock());
    }
    // Check if value-related UI should be displayed
    if (!checkEdgeValue(getEdgeValue)) {
      dispatch(setValueLock());
    }
  } else {
    dispatch(fetchDone());
    throw new Error('Data has already been imported');
  }
};

// Asynchronous forEach to ensure graph renders in a nice circle
const waitFor = ms => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
  for (const item of array) {
    await callback(item);
  }
}

// One function to rule them all
// Thunk to dispatch our calls
export default data => (dispatch, getState) => {
  const { graphList, getFns } = getGraph(getState());
  if (Array.isArray(data)) {
    asyncForEach(data, async graph => {
      try {
        await waitFor(0);
        processResponse(
          dispatch,
          graphList,
          getFns,
          processData(graph, getFns)
        );
      } catch (err) {
        dispatch(fetchError(err));
      }
    });
  } else {
    try {
      processResponse(dispatch, graphList, getFns, processData(data, getFns));
    } catch (err) {
      dispatch(fetchError(err));
    }
  }
};
