import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import { TFileContent } from './types';
import { EdgeListCsv, GraphData, GraphList, TLoadFormat } from '../../graph';
import {
  processPreviewEdgeList,
  processPreviewJson,
} from '../../graph/processors/import-preview';
import {
  combineProcessedData,
  combineDataWithDuplicates,
} from '../../../containers/Graph/styles/utils';
import { setDataPreview, setIsEdgeGroupable } from './slice';
import { show } from '../../ui/thunks';

const emptyGraphData: GraphData = {
  nodes: [],
  edges: [],
  metadata: { fields: { nodes: [], edges: [] } },
};

const createPreviewData = (
  graphList: GraphList,
  dispatch: any,
  combineData: any,
) => {
  const combinedGraphData = graphList.reduce(
    (acc: GraphData, graphData: GraphData) => {
      const clonedGraphData: GraphData = cloneDeep(graphData);
      const combinedGraph = combineData(acc, clonedGraphData);
      return combinedGraph;
    },
    emptyGraphData,
  );

  dispatch(setDataPreview(combinedGraphData));
};

const setEdgeGroupable = (graphList: GraphList, dispatch: any) => {
  const isEdgeGroupable: boolean = graphList.some((graphData: GraphData) => {
    return graphData.metadata.groupEdges.availability === true;
  });
  dispatch(setIsEdgeGroupable(isEdgeGroupable));
};

export const previewJson = (attachments: TFileContent[]) => (dispatch: any) => {
  const contentPromises: Promise<GraphList>[] = attachments.map(
    (attachment: TFileContent) => {
      const { data: dataWithStyle } = attachment.content as TLoadFormat;

      if (dataWithStyle) {
        return processPreviewJson(dataWithStyle, false);
      }

      const simpleGraphFormat = attachment.content as GraphData;
      return processPreviewJson(simpleGraphFormat, false);
    },
  );

  return Promise.all(contentPromises)
    .then((graphDataArr: GraphList[]) => {
      const graphList: GraphList = flatten(graphDataArr);
      createPreviewData(graphList, dispatch, combineProcessedData);
      setEdgeGroupable(graphList, dispatch);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(show(message, 'negative'));
    });
};

export const previewEdgeList = (attachments: TFileContent[]) => (
  dispatch: any,
) => {
  const batchDataPromises = attachments.map((attachment: TFileContent) => {
    const edgeList = attachment.content as EdgeListCsv['data'];
    return processPreviewEdgeList(edgeList);
  });

  return Promise.all(batchDataPromises)
    .then((graphList: GraphList) => {
      createPreviewData(graphList, dispatch, combineDataWithDuplicates);
      setEdgeGroupable(graphList, dispatch);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(show(message, 'negative'));
    });
};
