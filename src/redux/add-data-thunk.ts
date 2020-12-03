import some from 'lodash/some';
import isUndefined from 'lodash/isUndefined';
import flatten from 'lodash/flatten';
import { getGraph } from './combine-reducers';
import * as Graph from '../containers/Graph/types';

import { fetchBegin, fetchError, fetchDone } from './ui-slice';
import { addQuery, processGraphResponse } from './graph-slice';
import {
  OPTIONS as IMPORT_OPTIONS,
  ImportFormat,
  importEdgeListCsv,
  importNodeEdgeCsv,
  importJson,
  NodeEdgeDataType,
} from '../processors/import-data';

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
      throw new Error('Data has already been imported');
    }
  }
};

type ImportAccessors = Graph.Accessors | null;

/**
 * Thunk to add data to graph - processes CSV and add to graphList
 *
 * @param {ImportFormat[]} importData
 * @param {ImportAccessors} importAccessors = null
 *
 * @return void
 */
export const importEdgeListData = (
  importData: ImportFormat[],
  importAccessors: ImportAccessors = null,
) => async (dispatch: any, getState: any) => {
  const { graphList, accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };

  const batchDataPromises = importData.map((graphData: ImportFormat) => {
    const { data } = graphData;
    return importEdgeListCsv(data as string, accessors);
  });

  Promise.all(batchDataPromises)
    .then((graphData: Graph.GraphList) => {
      processResponse(dispatch, graphList, mainAccessors, graphData);
    })
    .catch((err: Error) => {
      dispatch(fetchError(err.message));
    });
};

/**
 * Thunk to add data to graph - processes JSON and add to graphList
 *
 * @param importData
 * @param importAccessors
 *
 * @return void
 */
export const importJsonData = (
  importData: ImportFormat[],
  importAccessors: ImportAccessors = null,
) => async (dispatch: any, getState: any) => {
  const { graphList, accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };

  const batchDataPromises = importData.map((graphData: ImportFormat) => {
    const { data } = graphData;
    return importJson(data as Graph.GraphList, accessors);
  });

  Promise.all(batchDataPromises)
    .then((graphDataArr: Graph.GraphList[]) => {
      const graphData: Graph.GraphList = flatten(graphDataArr);
      processResponse(dispatch, graphList, mainAccessors, graphData);
    })
    .catch((err: Error) => {
      dispatch(fetchError(err.message));
    });
};

export const importNodeEdgeData = (
  importData: ImportFormat,
  importAccessors: ImportAccessors = null,
) => async (dispatch: any, getState: any) => {
  const { data } = importData;
  const { graphList, accessors: mainAccessors } = getGraph(getState());
  const accessors = { ...mainAccessors, ...importAccessors };

  const { nodeData, edgeData } = data as NodeEdgeDataType;

  importNodeEdgeCsv(nodeData, edgeData, accessors)
    .then((graphData: Graph.GraphData) => {
      processResponse(dispatch, graphList, mainAccessors, graphData);
    })
    .catch((err: Error) => {
      dispatch(fetchError(err.message));
    });
};

/**
 * Thunk to add data to graph - processes JSON / CSV and add to graphList
 * Input can either be a single GraphData object or an array of GraphData
 *
 * @param {ImportFormat} importData
 * @param {ImportAccessors} [importAccessors=null] to customize node Id / edge Id / edge source or target
 */
export const addData = (
  importData: ImportFormat,
  importAccessors: ImportAccessors = null,
) => async (dispatch: any, getState: any) => {
  const { data, type } = importData;
  const { graphList, accessors: mainAccessors } = getGraph(getState());
  // Use importAccessors if available to do initial mapping
  const accessors = { ...mainAccessors, ...importAccessors };
  let newData: Promise<Graph.GraphData> | Promise<Graph.GraphList>;

  if (type === IMPORT_OPTIONS.json.id) {
    newData = importJson(data as Graph.GraphData | Graph.GraphList, accessors);
  } else if (type === IMPORT_OPTIONS.nodeEdgeCsv.id) {
    const { nodeData, edgeData } = data as {
      nodeData: string;
      edgeData: string;
    };
    newData = importNodeEdgeCsv(nodeData, edgeData, accessors);
  } else if (type === IMPORT_OPTIONS.edgeListCsv.id) {
    newData = importEdgeListCsv(data as string, accessors);
  } else {
    dispatch(fetchError('Invalid data format'));
  }

  return (
    newData
      // @ts-ignore
      .then((graphData: Graph.GraphData | Graph.GraphList) => {
        processResponse(dispatch, graphList, mainAccessors, graphData);
      })
      .catch((err: Error) => {
        dispatch(fetchError(err.message));
      })
  );
};
