import some from 'lodash/some';
import isUndefined from 'lodash/isUndefined';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import { getFilterOptions, getGraph, getStyleOptions } from './selectors';

import { addQuery, processGraphResponse, updateStyleOption } from './slice';
import {
  importEdgeListCsv,
  importNodeEdgeCsv,
  importJson,
} from './processors/import';
import {
  ImportFormat,
  NodeEdgeDataType,
  JsonImport,
  Accessors,
  GraphList,
  GraphData,
  FilterOptions,
  TLoadFormat,
  StyleOptions,
} from './types';

import { UISlices, UIThunks } from '../ui';

type ImportAccessors = Accessors | null;

const checkNewData = (graphList: GraphList, newData: GraphData): boolean => {
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
  graphList: GraphList,
  accessors: Accessors,
  newData: GraphData | GraphList,
) => {
  dispatch(UISlices.fetchBegin());
  for (const data of Array.isArray(newData) ? newData : [newData]) {
    // Check edges for new data as it might just be repeated
    if (checkNewData(graphList, data)) {
      dispatch(addQuery(data));
      dispatch(processGraphResponse({ data, accessors }));
      dispatch(UISlices.fetchDone());
    } else {
      dispatch(UISlices.fetchDone());
      throw new Error('Data has already imported');
    }
  }
};

/**
 * Display Toast Notification based on Filter Options' presence.
 *  1. Filter Option is not empty, display warning toast.
 *  2. Filter Option is empty, display success toast.
 *
 * @param {any} dispatch
 * @param {FilterOptions} filterOptions
 *
 * @return {void}
 */
const showImportDataToast = (
  dispatch: any,
  filterOptions: FilterOptions,
): void => {
  const isFilterEmpty: boolean = isEmpty(filterOptions);
  if (isFilterEmpty) {
    dispatch(UIThunks.show('Data imported successfully', 'positive'));
    return;
  }

  dispatch(UIThunks.show('Data imported with filters applied', 'warning'));
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
  const filterOptions: FilterOptions = getFilterOptions(getState());

  const batchDataPromises = importData.map((graphData: ImportFormat) => {
    const { data } = graphData;
    return importEdgeListCsv(data as string, accessors, metadataKey);
  });

  return Promise.all(batchDataPromises)
    .then((graphData: GraphList) => {
      processResponse(dispatch, graphList, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(UIThunks.show(message, 'negative'));
    });
};

/**
 *
 * Thunk to add data to graph - processes JSON and add to graphList
 * 1. apply the latest style options in the import file.
 * 2. changing layout must occurs before load graph's data
 *
 * @param {ImportFormat[]} importData - array of graphData objects
 * @param {ImportAccessors} importAccessors [importAccessors=null] to customize node Id / edge Id / edge source or target
 * @param {boolean} overwriteStyles - overwrite the existing graph styles
 *
 * @return Promise
 */
export const importJsonData = (
  importData: ImportFormat[],
  importAccessors: ImportAccessors = null,
  overwriteStyles = false,
) => (dispatch: any, getState: any) => {
  if (Array.isArray(importData) === false) {
    throw new Error('Provided import data is not an array');
  }

  const { graphList, accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: FilterOptions = getFilterOptions(getState());
  let isDataPossessStyle = false;
  let styleOptions: StyleOptions = getStyleOptions(getState());

  const batchDataPromises = importData.map((graphData: ImportFormat) => {
    const { data, style: importStyleOption } = graphData.data as TLoadFormat;

    if (importStyleOption) {
      isDataPossessStyle = true;
      styleOptions = importStyleOption;
    }

    return importJson(data as GraphList, accessors);
  });

  return Promise.all(batchDataPromises)
    .then((graphDataArr: GraphList[]) => {
      const graphData: GraphList = flatten(graphDataArr);

      if (isDataPossessStyle && overwriteStyles) {
        dispatch(updateStyleOption(styleOptions));
      }

      processResponse(dispatch, graphList, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(UIThunks.show(message, 'negative'));
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
  const filterOptions: FilterOptions = getFilterOptions(getState());

  const { nodeData, edgeData } = data as NodeEdgeDataType;
  const newData: Promise<GraphData> = importNodeEdgeCsv(
    nodeData,
    edgeData,
    accessors,
    metadataKey,
  );

  return newData
    .then((graphData: GraphData) => {
      processResponse(dispatch, graphList, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(UIThunks.show(message, 'negative'));
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
) => (dispatch: any, getState: any): Promise<void> => {
  if (Array.isArray(importData)) {
    throw new Error('importData parameter must be an object');
  }

  const { data } = importData;
  const { graphList, accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: FilterOptions = getFilterOptions(getState());

  const newData: Promise<GraphList> = importJson(data as GraphData, accessors);

  return newData
    .then((graphData: GraphList) => {
      processResponse(dispatch, graphList, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(UIThunks.show(message, 'negative'));
    });
};
