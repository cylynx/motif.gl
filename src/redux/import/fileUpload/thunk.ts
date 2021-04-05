import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import { SingleFileForms, TFileContent } from './types';
import {
  EdgeListCsv,
  GraphData,
  GraphList,
  TLoadFormat,
} from '../../graph/types';
import {
  processPreviewEdgeList,
  processPreviewJson,
  processPreviewNodeEdge,
} from '../../graph/processors/import-preview';
import {
  combineProcessedData,
  combineDataWithDuplicates,
} from '../../../containers/Graph/styles/utils';
import { setDataPreview, setIsEdgeGroupable, setStep } from './slice';
import { UIThunks } from '../../ui';
import { getFileUpload } from './selectors';

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

export const previewJson = (attachments: TFileContent[]) => async (
  dispatch: any,
  getState: any,
) => {
  const { step } = getFileUpload(getState());
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

  try {
    const graphDataArr = await Promise.all(contentPromises);
    const graphList: GraphList = flatten(graphDataArr);
    createPreviewData(graphList, dispatch, combineProcessedData);
    setEdgeGroupable(graphList, dispatch);
    nextStep(step, dispatch);
  } catch (err) {
    const { message } = err;
    dispatch(UIThunks.show(message, 'negative'));
  }
};

const nextStep = (step: number, dispatch: any) => {
  dispatch(setStep(step + 1));
};

export const previewEdgeList = (attachments: TFileContent[]) => (
  dispatch: any,
  getState: any,
) => {
  const { step } = getFileUpload(getState());

  const batchDataPromises = attachments.map((attachment: TFileContent) => {
    const edgeList = attachment.content as EdgeListCsv;
    return processPreviewEdgeList(edgeList);
  });

  return Promise.all(batchDataPromises)
    .then((graphList: GraphList) => {
      createPreviewData(graphList, dispatch, combineDataWithDuplicates);
      setEdgeGroupable(graphList, dispatch);
      nextStep(step, dispatch);
    })
    .catch((err: Error) => {
      const { message } = err;
      dispatch(UIThunks.show(message, 'negative'));
    });
};
export const previewNodeEdge = (attachments: SingleFileForms) => async (
  dispatch: any,
  getState: any,
) => {
  const { step } = getFileUpload(getState());
  const { nodeCsv, edgeCsv } = attachments as SingleFileForms;

  const nodeData: string[] = nodeCsv.map(
    (attachment: TFileContent) => attachment.content as string,
  );
  const edgeData: string[] = edgeCsv.map(
    (attachment: TFileContent) => attachment.content as string,
  );

  try {
    const graphData = await processPreviewNodeEdge(nodeData, edgeData);
    dispatch(setDataPreview(graphData));

    const { availability: isEdgeGroupable } = graphData.metadata.groupEdges;
    dispatch(setIsEdgeGroupable(isEdgeGroupable));
    nextStep(step, dispatch);
  } catch (err) {
    const { message } = err;
    dispatch(UIThunks.show(message, 'negative'));
  }
};
