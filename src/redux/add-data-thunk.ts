import some from 'lodash/some';
import isUndefined from 'lodash/isUndefined';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import { getFilterOptions, getGraph } from './combine-reducers';
import * as Graph from '../containers/Graph/types';

import { fetchBegin, fetchDone, showToast } from './ui-slice';
import { addQuery, processGraphResponse } from './graph-slice';
import {
  ImportFormat,
  importEdgeListCsv,
  importNodeEdgeCsv,
  importJson,
  NodeEdgeDataType,
  JsonImport,
} from '../processors/import-data';

type ImportAccessors = Graph.Accessors | null;

const checkNewData = (
  graphList: Graph.GraphList,
  newData: Graph.GraphData,
): boolean => {
  if (isUndefined(newData.metadata)) {
    // eslint-disable-next-line no-param-reassign
    newData.metadata = {
      key: 'abc',
    };
  }
  const graphListKeys = graphList.map((graph) => graph.metadata.key);
  return newData && !some(graphListKeys, (key) => key === newData.metadata.key);
};

const processResponse = (
  dispatch: any,
  graphList: Graph.GraphList,
  accessors: Graph.Accessors,
  newData: Graph.GraphData | Graph.GraphList,
) => {
  dispatch(fetchBegin());
  for (const data of Array.isArray(newData) ? newData : [newData]) {
    // Check edges for new data as it might just be repeated
    if (checkNewData(graphList, data)) {
      dispatch(addQuery(data));
      dispatch(processGraphResponse({ data, accessors }));
      dispatch(fetchDone());
    } else {
      dispatch(fetchDone());
      const message = 'Data has already been imported';
      dispatch(showToast({ message, kind: 'negative' }));
    }
  }
};

/**
 * Display Toast Notification based on Filter Options' presence.
 *  1. Filter Option is not empty, display warning toast.
 *  2. Filter Option is empty, display success toast.
 *
 * @param {any} dispatch
 * @param {Graph.FilterOptions} filterOptions
 *
 * @return {void}
 */
const showImportDataToast = (
  dispatch: any,
  filterOptions: Graph.FilterOptions,
): void => {
  const isFilterEmpty: boolean = isEmpty(filterOptions);
  if (isFilterEmpty) {
    dispatch(
      showToast({
        message: 'Data imported succesfully.',
        kind: 'positive',
      }),
    );
    return;
  }

  dispatch(
    showToast({
      message: 'Data imported with filters applied',
      kind: 'warning',
    }),
  );
};

/**
 * Thunk to add data to graph - processes CSV and add to graphList
 *
 * @param {ImportFormat[]} importData - array of graphData objects
 * @param {ImportAccessors} importAccessors = null
 * @param {string} metadataKey = null
 *
 * @return void
 */
export const importEdgeListData = (
  importData: ImportFormat[],
  importAccessors: ImportAccessors = null,
  metadataKey: string = null,
) => (dispatch: any, getState: any) => {
  if (Array.isArray(importData) === false) {
    throw new Error('importData parameter must be array');
  }

  const { graphList, accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: Graph.FilterOptions = getFilterOptions(getState());

  const batchDataPromises = importData.map((graphData: ImportFormat) => {
    const { data } = graphData;
    return importEdgeListCsv(data as string, accessors, metadataKey);
  });

  return Promise.all(batchDataPromises)
    .then((graphData: Graph.GraphList) => {
      processResponse(dispatch, graphList, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(showToast({ message, kind: 'negative' }));
    });
};

/**
 *
 * Thunk to add data to graph - processes JSON and add to graphList
 *
 * @param {ImportFormat[]} importData - array of graphData objects
 * @param {ImportAccessors} importAccessors [importAccessors=null] to customize node Id / edge Id / edge source or target
 *
 * @return Promise
 */
export const importJsonData = (
  importData: ImportFormat[],
  importAccessors: ImportAccessors = null,
) => (dispatch: any, getState: any) => {
  if (Array.isArray(importData) === false) {
    throw new Error('Provided import data is not an array');
  }

  const { graphList, accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: Graph.FilterOptions = getFilterOptions(getState());

  const batchDataPromises = importData.map((graphData: ImportFormat) => {
    const { data } = graphData;
    return importJson(data as Graph.GraphList, accessors);
  });

  return Promise.all(batchDataPromises)
    .then((graphDataArr: Graph.GraphList[]) => {
      const graphData: Graph.GraphList = flatten(graphDataArr);
      processResponse(dispatch, graphList, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(showToast({ message, kind: 'negative' }));
    });
};

/**
 * Thunk to add data to graph - processed CSV with node and edge and add to graph List
 *
 * @param {ImportFormat} importData - single graphData object
 * @param {ImportAccessors} importAccessors [importAccessors=null] - to customize node Id / edge Id / edge source or target
 * @param {number} metadataKey [metadataKey=null]
 * @return {Promise<GraphData>}
 */
export const importNodeEdgeData = (
  importData: ImportFormat,
  importAccessors: ImportAccessors = null,
  metadataKey: string = null,
) => (dispatch: any, getState: any) => {
  if (Array.isArray(importData)) {
    throw new Error('importData parameter must not be an array');
  }

  const { data } = importData;
  const { graphList, accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: Graph.FilterOptions = getFilterOptions(getState());

  const { nodeData, edgeData } = data as NodeEdgeDataType;
  const newData: Promise<Graph.GraphData> = importNodeEdgeCsv(
    nodeData,
    edgeData,
    accessors,
    metadataKey,
  );

  return newData
    .then((graphData: Graph.GraphData) => {
      processResponse(dispatch, graphList, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(showToast({ message, kind: 'negative' }));
    });
};

/**
 * Thunk to add single json data into graph
 *
 * @param {JsonImport} importData
 * @param {ImportAccessors} importAccessors [importAccessors=null] - to customize node Id / edge Id / edge source or target
 */
export const importSingleJsonData = (
  importData: JsonImport,
  importAccessors: ImportAccessors = null,
) => (dispatch: any, getState: any) => {
  if (Array.isArray(importData)) {
    throw new Error('importData parameter must be an object');
  }

  const { data } = importData;
  const { graphList, accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: Graph.FilterOptions = getFilterOptions(getState());

  const newData: Promise<Graph.GraphList> = importJson(
    data as Graph.GraphData,
    accessors,
  );

  return newData
    .then((graphData: Graph.GraphList) => {
      processResponse(dispatch, graphList, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(showToast({ message, kind: 'negative' }));
    });
};
