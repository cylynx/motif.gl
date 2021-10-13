import flatten from 'lodash/flatten';
import { SingleFileForms, TFileContent } from './types';
import * as FileUploadUtils from './utils';
import { MotifUploadError } from '../../../components/ImportErrorMessage';
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
} from '../../../utils/graph-utils/utils';
import { setDataPreview, setIsEdgeGroupable, setError } from './slice';
import { getFileUpload } from './selectors';

export const previewJson =
  (attachments: TFileContent[]) => async (dispatch: any, getState: any) => {
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
      const isInvalidNodes =
        FileUploadUtils.nodeContainRestrictedWords(graphList);
      if (isInvalidNodes) {
        const restrictedWordError = new MotifUploadError(
          'node-restricted-words',
        );
        dispatch(setError(restrictedWordError));
        return;
      }

      const isInvalidEdges =
        FileUploadUtils.edgeContainRestrictedWords(graphList);
      if (isInvalidEdges) {
        const restrictedWordError = new MotifUploadError(
          'edge-restricted-words',
        );
        dispatch(setError(restrictedWordError));
        return;
      }

      FileUploadUtils.createPreviewData(
        graphList,
        dispatch,
        combineProcessedData,
      );
      FileUploadUtils.setEdgeGroupable(graphList, dispatch);
      FileUploadUtils.nextStep(step, dispatch);
      dispatch(setError(null));
    } catch (err: any) {
      dispatch(setError(err));
    }
  };

export const previewEdgeList =
  (attachments: TFileContent[]) => (dispatch: any, getState: any) => {
    const { step } = getFileUpload(getState());

    const batchDataPromises = attachments.map((attachment: TFileContent) => {
      const edgeList = attachment.content as EdgeListCsv;
      return processPreviewEdgeList(edgeList);
    });

    return Promise.all(batchDataPromises)
      .then((graphList: GraphList) => {
        const isInvalidEdges =
          FileUploadUtils.edgeContainRestrictedWords(graphList);
        if (isInvalidEdges) {
          const restrictedWordError = new MotifUploadError(
            'edge-restricted-words',
          );
          dispatch(setError(restrictedWordError));
          return;
        }

        FileUploadUtils.createPreviewData(
          graphList,
          dispatch,
          combineDataWithDuplicates,
        );
        FileUploadUtils.setEdgeGroupable(graphList, dispatch);
        FileUploadUtils.nextStep(step, dispatch);
        dispatch(setError(null));
      })
      .catch((err: Error) => {
        dispatch(setError(err));
      });
  };

export const previewNodeEdge =
  (attachments: SingleFileForms) => async (dispatch: any, getState: any) => {
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
      const isInvalidNodes = FileUploadUtils.nodeContainRestrictedWords([
        graphData,
      ]);
      if (isInvalidNodes) {
        const restrictedWordError = new MotifUploadError(
          'node-restricted-words',
        );
        dispatch(setError(restrictedWordError));
        return;
      }

      const isInvalidEdges = FileUploadUtils.edgeContainRestrictedWords([
        graphData,
      ]);
      if (isInvalidEdges) {
        const restrictedWordError = new MotifUploadError(
          'edge-restricted-words',
        );
        dispatch(setError(restrictedWordError));
        return;
      }

      dispatch(setDataPreview(graphData));

      const { availability: isEdgeGroupable } = graphData.metadata.groupEdges;
      dispatch(setIsEdgeGroupable(isEdgeGroupable));

      // remove error message when upload valid data
      dispatch(setError(null));
      FileUploadUtils.nextStep(step, dispatch);
    } catch (err: any) {
      dispatch(setError(err));
    }
  };
