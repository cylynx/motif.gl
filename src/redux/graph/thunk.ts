import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import { getFilterOptions, getGraph, getStyleOptions } from './selectors';

import {
  updateGraphFlatten,
  addQuery,
  processGraphResponse,
  updateStyleOption,
} from './slice';
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
  GraphState,
} from './types';

import { UISlices, UIThunks } from '../ui';
import {
  groupEdgesForImportation,
  groupEdgesWithConfiguration,
} from './processors/group-edges';

type ImportAccessors = Accessors | null;

const processResponse = (
  dispatch: any,
  accessors: Accessors,
  newData: GraphData | GraphList,
) => {
  dispatch(UISlices.fetchBegin());

  // ensure the graph must be in array formats.
  const graphList: GraphList = Array.isArray(newData) ? newData : [newData];

  graphList.forEach((graphData: GraphData) => {
    // appends graph data into graph list.
    dispatch(addQuery(graphData));

    // create a new copies of object to modify immutable objects.
    let modData = graphData;

    // perform group edges based on user preferences during data importation.
    if (graphData.metadata.groupEdges.toggle) {
      modData = groupEdgesForImportation(
        graphData,
        graphData.metadata.groupEdges,
      );
    }

    // combine new graph data with existing graph data to form graph flattens.
    dispatch(processGraphResponse({ data: modData, accessors }));
  });

  dispatch(UISlices.fetchDone());
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
 * @param groupEdges - determine whether should group the edges.
 * @param {ImportAccessors} importAccessors = null
 * @param {string} metadataKey = null
 *
 * @return void
 */
export const importEdgeListData = (
  importData: ImportFormat[],
  groupEdges = true,
  importAccessors: ImportAccessors = null,
  metadataKey: string = null,
) => (dispatch: any, getState: any) => {
  if (Array.isArray(importData) === false) {
    throw new Error('importData parameter must be array');
  }

  const { accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: FilterOptions = getFilterOptions(getState());

  const batchDataPromises = importData.map((graphData: ImportFormat) => {
    const { data } = graphData;
    return importEdgeListCsv(
      data as string,
      accessors,
      groupEdges,
      metadataKey,
    );
  });

  return Promise.all(batchDataPromises)
    .then((graphData: GraphList) => {
      processResponse(dispatch, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(UIThunks.show(message, 'negative'));
      dispatch(UISlices.fetchDone());
    });
};

/**
 *
 * Thunk to add data to graph - processes JSON and add to graphList
 * 1. apply the latest style options in the import file.
 * 2. changing layout must occurs before load graph's data
 * 3. allow original graphin format to import for backward compatibility
 *
 * @param {ImportFormat[]} importData - array of graphData objects
 * @param {boolean} groupEdges - decides whether graph's edges shall be grouped.
 * @param {ImportAccessors} importAccessors [importAccessors=null] to customize node Id / edge Id / edge source or target
 * @param {boolean} overwriteStyles - overwrite the existing graph styles
 *
 * @return Promise
 */
export const importJsonData = (
  importData: ImportFormat[],
  groupEdges = true,
  importAccessors: ImportAccessors = null,
  overwriteStyles = false,
) => (dispatch: any, getState: any) => {
  if (Array.isArray(importData) === false) {
    throw new Error('Provided import data is not an array');
  }

  const { accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: FilterOptions = getFilterOptions(getState());
  let isDataPossessStyle = false;
  let styleOptions: StyleOptions = getStyleOptions(getState());

  const batchDataPromises = importData.map((graphData: ImportFormat) => {
    const { data: dataWithStyle } = graphData.data as TLoadFormat;

    if (dataWithStyle) {
      const { style: importStyleOption } = graphData.data as TLoadFormat;

      if (importStyleOption) {
        isDataPossessStyle = true;
        styleOptions = importStyleOption;
      }

      return importJson(dataWithStyle as GraphList, accessors, groupEdges);
    }

    const { data } = graphData;
    return importJson(data as GraphList, accessors, groupEdges);
  });

  return Promise.all(batchDataPromises).then((graphDataArr: GraphList[]) => {
    const graphData: GraphList = flatten(graphDataArr);

    if (isDataPossessStyle && overwriteStyles) {
      dispatch(updateStyleOption(styleOptions));
    }

    processResponse(dispatch, mainAccessors, graphData);
    showImportDataToast(dispatch, filterOptions);
  });
  // .catch((err: Error) => {
  //   const { message } = err;
  //   dispatch(UIThunks.show(message, 'negative'));
  //   dispatch(UISlices.fetchDone());
  // });
};

/**
 * Thunk to add data to graph - processed CSV with node and edge and add to graph List
 *
 * @param {ImportFormat} importData - single graphData object
 * @param {boolean} groupEdges - group graph's edges
 * @param {ImportAccessors} importAccessors [importAccessors=null] - to customize node Id / edge Id / edge source or target
 * @param {number} metadataKey [metadataKey=null]
 * @return {Promise<GraphData>}
 */
export const importNodeEdgeData = (
  importData: ImportFormat,
  groupEdges = true,
  importAccessors: ImportAccessors = null,
  metadataKey: string = null,
) => (dispatch: any, getState: any) => {
  if (Array.isArray(importData)) {
    throw new Error('importData parameter must not be an array');
  }

  const { data } = importData;
  const { accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: FilterOptions = getFilterOptions(getState());

  const { nodeData, edgeData } = data as NodeEdgeDataType;
  const newData: Promise<GraphData> = importNodeEdgeCsv(
    nodeData,
    edgeData,
    accessors,
    groupEdges,
    metadataKey,
  );

  return newData
    .then((graphData: GraphData) => {
      processResponse(dispatch, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(UIThunks.show(message, 'negative'));
      dispatch(UISlices.fetchDone());
    });
};

/**
 * Thunk to add single json data into graph.
 *
 * @param {JsonImport} importData
 * @param {boolean} groupEdges [groupEdges=true] - group graph's edges
 * @param {ImportAccessors} importAccessors [importAccessors=null] - to customize node Id / edge Id / edge source or target
 */
export const importSingleJsonData = (
  importData: JsonImport,
  importAccessors: ImportAccessors = null,
  groupEdges = false,
) => (dispatch: any, getState: any): Promise<void> => {
  if (Array.isArray(importData)) {
    throw new Error('importData parameter must be an object');
  }

  const { data } = importData;
  const { accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: FilterOptions = getFilterOptions(getState());

  const newData: Promise<GraphList> = importJson(
    data as GraphData,
    accessors,
    groupEdges,
  );

  return newData
    .then((graphData: GraphList) => {
      processResponse(dispatch, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(UIThunks.show(message, 'negative'));
      dispatch(UISlices.fetchDone());
    });
};

/**
 * Perform group edges based on preferences and graph edge configurations.
 *
 * @param {number} graphIndex - identify specific graph list to perform edge aggregations
 * @return {void}
 */
export const groupEdgesWithAggregation = (graphIndex: number) => (
  dispatch: any,
  getState: any,
) => {
  const { graphList, graphFlatten }: GraphState = getGraph(getState());
  const selectedGraphList: GraphData = graphList[graphIndex];

  const { groupEdges } = selectedGraphList.metadata;

  const newGraphData = groupEdgesWithConfiguration(
    selectedGraphList,
    graphFlatten,
    groupEdges,
  );

  dispatch(updateGraphFlatten(newGraphData));
};
