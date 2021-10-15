import { flatten, isEmpty, cloneDeep, uniqBy } from 'lodash';
import { combineGraphs } from '../../utils/graph-utils/utils';
import { getFilterOptions, getGraph, getStyleOptions } from './selectors';

import * as GraphSlices from './slice';
import {
  importEdgeListCsv,
  importNodeEdgeCsv,
  importJson,
} from './processors/import';
import * as T from './types';
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

type ImportAccessors = T.Accessors | null;

const processResponse = (
  dispatch: any,
  accessors: T.Accessors,
  newData: T.GraphData | T.GraphList,
) => {
  const graphList: T.GraphList = Array.isArray(newData) ? newData : [newData];

  const modifiedGraphList = [];
  const groupedEdgeGraphList: T.GraphList = graphList.map(
    (graphData: T.GraphData) => {
      if (graphData.metadata.groupEdges.toggle) {
        const { graphData: groupedEdgeData, groupEdgeIds } =
          groupEdgesForImportation(graphData, graphData.metadata.groupEdges);
        const modData = cloneDeep(graphData);
        modData.metadata.groupEdges.ids = groupEdgeIds;
        modifiedGraphList.push(modData);

        return groupedEdgeData;
      }

      modifiedGraphList.push(graphData);
      return graphData;
    },
  );

  dispatch(GraphSlices.addQuery(modifiedGraphList));
  const mergedGraph = combineGraphs(groupedEdgeGraphList);

  // combine new graph data with existing graph data to form graph flattens.
  dispatch(GraphSlices.processGraphResponse({ data: mergedGraph, accessors }));
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
  filterOptions: T.FilterOptions,
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
export const importEdgeListData =
  (
    importData: T.EdgeListCsv[],
    groupEdges = true,
    importAccessors: ImportAccessors = null,
    metadataKey: string = null,
  ) =>
  (dispatch: any, getState: any) => {
    const { accessors: mainAccessors } = getGraph(getState());
    const accessors = { ...mainAccessors, ...importAccessors };
    const filterOptions: T.FilterOptions = getFilterOptions(getState());

    const batchDataPromises = importData.map((graphData: T.EdgeListCsv) => {
      return importEdgeListCsv(graphData, accessors, groupEdges, metadataKey);
    });

    return Promise.all(batchDataPromises)
      .then((graphData: T.GraphList) => {
        dispatch(UISlices.fetchBegin());

        setTimeout(() => {
          processResponse(dispatch, mainAccessors, graphData);
          showImportDataToast(dispatch, filterOptions);
          dispatch(FileUploadSlices.resetState());
          dispatch(UISlices.clearError());
          dispatch(UISlices.fetchDone());
          dispatch(UISlices.closeModal());
        }, 50);
      })
      .catch((err: Error) => {
        dispatch(UISlices.displayError(err));
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
export const importJsonData =
  (
    importData: T.JsonImport[],
    groupEdges = true,
    importAccessors: Partial<ImportAccessors> = {},
    overwriteStyles = false,
  ) =>
  (dispatch: any, getState: any) => {
    const isCustomAccessorEmpty = isEmpty(importAccessors);

    const { accessors: mainAccessors } = getGraph(getState());
    const accessors = isCustomAccessorEmpty
      ? mainAccessors
      : (importAccessors as ImportAccessors);

    let filterOptions: T.FilterOptions = getFilterOptions(getState());
    let styleOptions: T.StyleOptions = getStyleOptions(getState());
    let isDataPossessStyle = false;
    let isDataPossessFilter = false;

    const batchDataPromises = importData.map((graphData: T.JsonImport) => {
      const { data: dataWithStyle } = graphData as T.TLoadFormat;

      if (dataWithStyle) {
        const { style: importStyleOption, filter: importFilterOption } =
          graphData as T.TLoadFormat;

        if (importStyleOption) {
          isDataPossessStyle = true;
          styleOptions = importStyleOption;
        }

        if (importFilterOption) {
          isDataPossessFilter = true;
          filterOptions = importFilterOption;
        }

        return importJson(dataWithStyle as T.GraphList, accessors, groupEdges);
      }

      return importJson(
        graphData as T.GraphList | T.GraphData,
        accessors,
        groupEdges,
      );
    });

    return Promise.all(batchDataPromises)
      .then((graphDataArr: T.GraphList[]) => {
        dispatch(UISlices.fetchBegin());

        setTimeout(() => {
          const graphData: T.GraphList = flatten(graphDataArr);

          if (isDataPossessStyle && overwriteStyles) {
            dispatch(GraphSlices.updateStyleOption(styleOptions));
          }

          if (isDataPossessFilter) {
            dispatch(GraphSlices.updateFilterOption(filterOptions));
          }

          processResponse(dispatch, accessors, graphData);

          showImportDataToast(dispatch, filterOptions);
          dispatch(FileUploadSlices.resetState());
          dispatch(UISlices.clearError());
          dispatch(UISlices.fetchDone());
          dispatch(UISlices.closeModal());
        }, 50);
      })
      .catch((err: any) => {
        dispatch(UISlices.displayError(err));
        dispatch(UISlices.fetchDone());
      });
  };

/**
 * Thunk to add data to graph - processed CSV with node and edge and add to graph List
 *
 * @param {SingleFileForms} importData - attachment contains one or more node edge attachments
 * @param {boolean} groupEdges - group graph's edges
 * @param {Partial<ImportAccessors>} importAccessors [importAccessors={}] - to customize node Id / edge Id / edge source or target
 * @param {number} metadataKey [metadataKey=null]
 * @return {Promise<GraphData>}
 */
export const importNodeEdgeData =
  (
    importData: SingleFileForms,
    groupEdges = true,
    importAccessors: Partial<ImportAccessors> = {},
    metadataKey: string = null,
  ) =>
  (dispatch: any, getState: any) => {
    const { accessors: mainAccessors } = getGraph(getState());
    const accessors = isEmpty(importAccessors)
      ? mainAccessors
      : (importAccessors as ImportAccessors);
    const filterOptions: T.FilterOptions = getFilterOptions(getState());

    const { nodeCsv: nodeContents, edgeCsv: edgeContents } = importData;
    const nodeCsvs: string[] = nodeContents.map(
      (nodeCsv: TFileContent) => nodeCsv.content as string,
    );
    const edgeCsvs: string[] = edgeContents.map(
      (edgeCsv: TFileContent) => edgeCsv.content as string,
    );

    const newData: Promise<T.GraphData> = importNodeEdgeCsv(
      nodeCsvs,
      edgeCsvs,
      accessors,
      groupEdges,
      metadataKey,
    );

    return newData
      .then((graphData: T.GraphData) => {
        dispatch(UISlices.fetchBegin());

        setTimeout(() => {
          processResponse(dispatch, accessors, graphData);
          showImportDataToast(dispatch, filterOptions);
          dispatch(FileUploadSlices.resetState());
          dispatch(UISlices.fetchDone());
          dispatch(UISlices.closeModal());
        }, 50);
      })
      .catch((err: any) => {
        dispatch(UISlices.displayError(err));
        dispatch(UISlices.fetchDone());
      });
  };

/**
 * Thunk to add sample data into graph
 *
 * @param {JsonImport} importData
 * @param {boolean} groupEdges [groupEdges=true] - group graph's edges
 * @param {Partial<ImportAccessors>} importAccessors [importAccessors={}] - to customize node Id / edge Id / edge source or target
 */
export const importSampleData =
  (
    importData: T.JsonImport,
    importAccessors: Partial<ImportAccessors> = {},
    groupEdges = false,
  ) =>
  async (dispatch: any, getState: any): Promise<void> => {
    const { accessors: mainAccessors } = getGraph(getState());

    const accessors = isEmpty(importAccessors)
      ? mainAccessors
      : (importAccessors as ImportAccessors);
    const filterOptions: T.FilterOptions = getFilterOptions(getState());

    const newData: Promise<T.GraphList> = importJson(
      importData as T.GraphData,
      accessors,
      groupEdges,
    );

    return newData
      .then((graphData: T.GraphList) => {
        dispatch(UISlices.fetchBegin());

        setTimeout(() => {
          processResponse(dispatch, accessors, graphData);
          showImportDataToast(dispatch, filterOptions);
          dispatch(FileUploadSlices.resetState());
          dispatch(UISlices.clearError());
          dispatch(UISlices.fetchDone());
          dispatch(UISlices.closeModal());
        }, 50);
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
export const groupEdgesWithAggregation =
  (graphIndex: number) => (dispatch: any, getState: any) => {
    const { graphList, graphFlatten }: T.GraphState = getGraph(getState());
    const selectedGraphList: T.GraphData = graphList[graphIndex];

    const { groupEdges } = selectedGraphList.metadata;

    const { graphData: newGraphData, groupEdgeIds } =
      groupEdgesWithConfiguration(selectedGraphList, graphFlatten, groupEdges);

    // obtain the combined aggregated edge fields of entire graph.
    const combinedAggregatedEdgeFields: T.Field[][] = graphList.reduce(
      (acc: T.Field[][], graphData: T.GraphData) => {
        const { metadata } = graphData;

        const edgeAggregateFields: T.Field[] = aggregateMetadataFields(
          graphData,
          metadata.groupEdges.fields,
        );

        const combinedEdgeField = uniqBy(
          [...metadata.fields.edges, ...edgeAggregateFields],
          'name',
        ) as T.Field[];

        acc.push(combinedEdgeField);
        return acc;
      },
      [],
    );

    // map the aggregated edge fields as edge selections
    const flattenEdgeFields: T.Field[] = flatten(combinedAggregatedEdgeFields);
    const uniqueEdgeFields = uniqBy(flattenEdgeFields, 'name') as T.Field[];

    const modData = cloneDeep(newGraphData);

    Object.assign(modData.metadata.fields, {
      edges: uniqueEdgeFields,
    });

    dispatch(GraphSlices.updateGraphFlatten(modData));
    dispatch(GraphSlices.updateGroupEdgeIds({ graphIndex, groupEdgeIds }));
  };

/**
 * Update edge selections based on group edge configurations.
 *
 * @return {void}
 */
export const computeEdgeSelection =
  () =>
  (dispatch: any, getState: any): void => {
    const { graphFlatten, edgeSelection }: T.GraphState = getGraph(getState());
    const { edges: edgeFields } = graphFlatten.metadata.fields;

    const computedEdgeSelection: T.Selection[] = edgeFields.map(
      (edgeField: T.Field) => {
        const { name, type } = edgeField;
        const existingSelection = edgeSelection.find(
          (selection: T.Selection) => selection.id === edgeField.name,
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

    dispatch(GraphSlices.overwriteEdgeSelection(computedEdgeSelection));
  };
