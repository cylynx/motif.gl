import some from 'lodash/some';
import store from '../redux/store';

import {
  fetchBegin,
  fetchError,
  fetchDone,
  postMessage,
  setBottomOpen,
} from '../redux/graphInitSlice';
import {
  addQuery,
  processGraphResponse,
} from '../redux/graphSlice';
import { processData } from '../Utilities/utils';

const state = store.getState();

// API Methods
const checkMetaData = metadata => {
  if (metadata.search_size > metadata.retrieved_size) {
    const message = `${metadata.retrieved_size} / ${metadata.search_size} of the most recent transactions retrieved.
        We plan to allow large imports and visualization in the full version.
        Feel free to reach out to timothy at timothy.lin@cylynx.io if you are interesting in retrieving the full results.`;
    store.dispatch(postMessage(message));
  }
};

const checkNewData = newData => {
  const graphListKeys = store
    .getState()
    .graph.present.graphList.map(graph => graph.metadata.key);
  return (
    newData &&
    !some(graphListKeys, key => key === newData.metadata.key) &&
    newData.edges.length > 0
  );
};

const processResponse = newData => {
  if (newData.metadata) {
    checkMetaData(newData.metadata);
  }
  // Need to check edges for new data as it might just return nodes and repetition
  if (checkNewData(newData)) {
    console.log("run here");
    store.dispatch(addQuery(newData));
    store.dispatch(processGraphResponse(newData));
    store.dispatch(fetchDone());
    store.dispatch(setBottomOpen(true));
  } else {
    store.dispatch(fetchDone());
    throw new Error('Data has already been imported');
  }
};

export const uploadData = data => {
  processResponse(processData(data));  
};

// Asynchronous forEach to ensure graph renders in a nice circle
const waitFor = ms => new Promise(r => setTimeout(r, ms));

async function asyncForEach(array, callback) {
  for (const item of array) {
    await callback(item);
  }
}

// File Tab

export const uploadJSON = json => {
  store.dispatch(fetchBegin());
  try {
    asyncForEach(json, async graph => {
      await waitFor(0);
      uploadData(graph);
    });  
  } catch (error) {
    store.dispatch(fetchError(error));
  }
};