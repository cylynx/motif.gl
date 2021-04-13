import { flatten, isEmpty, cloneDeep, uniqBy } from 'lodash';
import { getFilterOptions, getGraph, getStyleOptions } from './selectors';

import {
  updateGraphFlatten,
  addQuery,
  processGraphResponse,
  updateStyleOption,
  overwriteEdgeSelection,
} from './slice';
import {
  importEdgeListCsv,
  importNodeEdgeCsv,
  importJson,
} from './processors/import';
import {
  JsonImport,
  Accessors,
  GraphList,
  GraphData,
  FilterOptions,
  TLoadFormat,
  StyleOptions,
  GraphState,
  Field,
  Selection,
  EdgeListCsv,
} from './types';

import { UISlices, UIThunks } from '../ui';
import {
  aggregateMetadataFields,
  groupEdgesForImportation,
  groupEdgesWithConfiguration,
} from './processors/group-edges';
import {
  FileUploadSlices,
  SingleFileForms,
  TFileContent,
} from '../import/fileUpload';

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
  importData: EdgeListCsv[],
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

  const batchDataPromises = importData.map((graphData: EdgeListCsv) => {
    return importEdgeListCsv(graphData, accessors, groupEdges, metadataKey);
  });

  return Promise.all(batchDataPromises)
    .then((graphData: GraphList) => {
      processResponse(dispatch, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
      dispatch(FileUploadSlices.resetState());
      dispatch(UISlices.closeModal());
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
  importData: JsonImport[],
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

  const batchDataPromises = importData.map((graphData: JsonImport) => {
    const { data: dataWithStyle } = graphData as TLoadFormat;

    if (dataWithStyle) {
      const { style: importStyleOption } = graphData as TLoadFormat;

      if (importStyleOption) {
        isDataPossessStyle = true;
        styleOptions = importStyleOption;
      }

      return importJson(dataWithStyle as GraphList, accessors, groupEdges);
    }

    return importJson(
      graphData as GraphList | GraphData,
      accessors,
      groupEdges,
    );
  });

  return Promise.all(batchDataPromises)
    .then((graphDataArr: GraphList[]) => {
      const graphData: GraphList = flatten(graphDataArr);

      if (isDataPossessStyle && overwriteStyles) {
        dispatch(updateStyleOption(styleOptions));
      }

      processResponse(dispatch, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
      dispatch(FileUploadSlices.resetState());
      dispatch(UISlices.closeModal());
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(UIThunks.show(message, 'negative'));
      dispatch(UISlices.fetchDone());
    });
};

/**
 * Thunk to add data to graph - processed CSV with node and edge and add to graph List
 *
 * @param {SingleFileForms} importData - attachment contains one or more node edge attachments
 * @param {boolean} groupEdges - group graph's edges
 * @param {ImportAccessors} importAccessors [importAccessors=null] - to customize node Id / edge Id / edge source or target
 * @param {number} metadataKey [metadataKey=null]
 * @return {Promise<GraphData>}
 */
export const importNodeEdgeData = (
  importData: SingleFileForms,
  groupEdges = true,
  importAccessors: ImportAccessors = null,
  metadataKey: string = null,
) => (dispatch: any, getState: any) => {
  if (Array.isArray(importData)) {
    throw new Error('importData parameter must not be an array');
  }

  const { accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: FilterOptions = getFilterOptions(getState());

  const { nodeCsv: nodeContents, edgeCsv: edgeContents } = importData;
  const nodeCsvs: string[] = nodeContents.map(
    (nodeCsv: TFileContent) => nodeCsv.content as string,
  );
  const edgeCsvs: string[] = edgeContents.map(
    (edgeCsv: TFileContent) => edgeCsv.content as string,
  );

  const newData: Promise<GraphData> = importNodeEdgeCsv(
    nodeCsvs,
    edgeCsvs,
    accessors,
    groupEdges,
    metadataKey,
  );

  return newData
    .then((graphData: GraphData) => {
      processResponse(dispatch, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
      dispatch(FileUploadSlices.resetState());
      dispatch(UISlices.closeModal());
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(UIThunks.show(message, 'negative'));
      dispatch(UISlices.fetchDone());
    });
};

/**
 * Thunk to add sample data into graph
 *
 * @param {JsonImport} importData
 * @param {boolean} groupEdges [groupEdges=true] - group graph's edges
 * @param {ImportAccessors} importAccessors [importAccessors=null] - to customize node Id / edge Id / edge source or target
 */
export const importSampleData = (
  importData: JsonImport,
  importAccessors: ImportAccessors = null,
  groupEdges = false,
) => async (dispatch: any, getState: any): Promise<void> => {
  const { accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };
  const filterOptions: FilterOptions = getFilterOptions(getState());

  const newData: Promise<GraphList> = importJson(
    importData as GraphData,
    accessors,
    groupEdges,
  );

  return newData
    .then((graphData: GraphList) => {
      processResponse(dispatch, mainAccessors, graphData);
      showImportDataToast(dispatch, filterOptions);
      dispatch(FileUploadSlices.resetState());
      dispatch(UISlices.closeModal());
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

  // obtain the combined aggregated edge fields of entire graph.
  const combinedAggregatedEdgeFields: Field[][] = graphList.reduce(
    (acc: Field[][], graphData: GraphData) => {
      const { metadata } = graphData;

      const edgeAggregateFields: Field[] = aggregateMetadataFields(
        graphData,
        metadata.groupEdges.fields,
      );

      const combinedEdgeField = uniqBy(
        [...metadata.fields.edges, ...edgeAggregateFields],
        'name',
      ) as Field[];

      acc.push(combinedEdgeField);
      return acc;
    },
    [],
  );

  // map the aggregated edge fields as edge selections
  const flattenEdgeFields: Field[] = flatten(combinedAggregatedEdgeFields);
  const uniqueEdgeFields = uniqBy(flattenEdgeFields, 'name') as Field[];

  const modData = cloneDeep(newGraphData);

  Object.assign(modData.metadata.fields, {
    edges: uniqueEdgeFields,
  });

  dispatch(updateGraphFlatten(modData));
};

/**
 * Update edge selections based on group edge configurations.
 *
 * @return {void}
 */
export const computeEdgeSelection = () => (
  dispatch: any,
  getState: any,
): void => {
  const { graphFlatten, edgeSelection }: GraphState = getGraph(getState());
  const { edges: edgeFields } = graphFlatten.metadata.fields;

  const computedEdgeSelection: Selection[] = edgeFields.map(
    (edgeField: Field) => {
      const { name, type } = edgeField;
      const existingSelection = edgeSelection.find(
        (selection: Selection) => selection.id === edgeField.name,
      );
      const isSelected: boolean = existingSelection?.selected ?? false;

      return {
        id: name,
        label: name,
        type,
        selected: isSelected,
      };
    },
  );

  dispatch(overwriteEdgeSelection(computedEdgeSelection));
};
