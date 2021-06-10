import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';
import { ToasterContainer } from 'baseui/toast';
import cloneDeep from 'lodash/cloneDeep';
import {
  initialState,
  setDataPreview,
  setError,
  setIsEdgeGroupable,
  setStep,
} from '../slice';
import {
  multipleSimpleGraph,
  singleSimpleGraph,
  restrictedWordJson,
  singleNodeEdgeData,
  multipleNodeEdgeData,
  restrictedNodeEdge,
  edgeListCsv,
} from './constant';
import { previewEdgeList, previewJson, previewNodeEdge } from '../thunk';
import { TFileContent } from '../types';
import { GraphList } from '../../../graph';
import {
  combineProcessedData,
  combineDataWithDuplicates,
} from '../../../../utils/graph-utils/utils';
import {
  processPreviewEdgeList,
  processPreviewNodeEdge,
} from '../../../graph/processors/import-preview';

const mockStore = configureStore([thunk]);
const getStore = () => {
  const fileUploadState = cloneDeep(initialState);
  const store = {
    investigate: {
      ui: {},
      widget: {},
      graph: {},
      import: {
        fileUpload: fileUploadState,
      },
    },
  };
  return store;
};

describe('Import Preview - thunk.test.js', () => {
  const store = mockStore(getStore());
  beforeEach(() => {
    render(<ToasterContainer />);
  });

  afterEach(() => {
    store.clearActions();
  });

  describe('previewJson', () => {
    it('should import simple graph data', async () => {
      const singleImport: TFileContent[] = [
        {
          fileName: 'single-import.json',
          content: [singleSimpleGraph] as GraphList,
        },
      ];

      const actions = [
        setDataPreview(singleSimpleGraph),
        setIsEdgeGroupable(false),
        setStep(2),
      ];

      // @ts-ignore
      await store.dispatch(previewJson(singleImport));
      expect(store.getActions()).toEqual(actions);
    });

    it('should import multiple simple graph data', async () => {
      const multipleImport: TFileContent[] = [
        {
          fileName: 'multiple-import.json',
          content: multipleSimpleGraph,
        },
      ];

      const [firstGraph, secondGraph] = multipleSimpleGraph;
      const combinedData = combineProcessedData(firstGraph, secondGraph);

      const actions = [
        setDataPreview(combinedData),
        setIsEdgeGroupable(false),
        setStep(2),
      ];

      // @ts-ignore
      await store.dispatch(previewJson(multipleImport));
      expect(store.getActions()).toEqual(actions);
    });

    it('should display error message when import restricted dataset', async () => {
      const singleImport: TFileContent[] = [
        {
          fileName: 'restricted-words.json',
          content: [restrictedWordJson] as GraphList,
        },
      ];

      const actions = [setError('restricted-words')];

      // @ts-ignore
      await store.dispatch(previewJson(singleImport));
      expect(store.getActions()).toEqual(actions);
    });
  });

  describe('previewEdgeList', () => {
    it('should import csv successfully', async () => {
      const attachments = [
        {
          fileName: 'first.csv',
          content: edgeListCsv,
        },
      ];

      const graphData = await processPreviewEdgeList(edgeListCsv);

      const actions = [
        setDataPreview(graphData),
        setIsEdgeGroupable(false),
        setStep(2),
      ];

      // @ts-ignore
      await store.dispatch(previewEdgeList(attachments));
      expect(store.getActions()).toEqual(actions);
    });

    it('should import multiple csv successfully', async () => {
      const attachments = [
        {
          fileName: 'first.csv',
          content: edgeListCsv,
        },
        {
          fileName: 'second.csv',
          content: edgeListCsv,
        },
      ];

      const firstGraph = await processPreviewEdgeList(edgeListCsv);
      const secondGraph = await processPreviewEdgeList(edgeListCsv);

      const combinedGraph = combineDataWithDuplicates(firstGraph, secondGraph);

      const actions = [
        setDataPreview(combinedGraph),
        setIsEdgeGroupable(false),
        setStep(2),
      ];

      // @ts-ignore
      await store.dispatch(previewEdgeList(attachments));
      expect(store.getActions()).toEqual(actions);
    });
  });

  describe('previewNodeEdge', () => {
    it('should import node and edges successfully', async () => {
      const { nodeCsv, edgeCsv } = singleNodeEdgeData;
      const nodeCsvContent = nodeCsv[0].content as string;
      const edgeCsvContent = edgeCsv[0].content as string;

      const graphData = await processPreviewNodeEdge(
        [nodeCsvContent],
        [edgeCsvContent],
      );

      const actions = [
        setDataPreview(graphData),
        setIsEdgeGroupable(false),
        setError(null),
        setStep(2),
      ];

      // @ts-ignore
      await store.dispatch(previewNodeEdge(singleNodeEdgeData));
      expect(store.getActions()).toEqual(actions);
    });

    it('should import multiple nodes and edges successfully', async () => {
      const { nodeCsv, edgeCsv } = multipleNodeEdgeData;

      const nodeData: string[] = nodeCsv.map(
        (attachment: TFileContent) => attachment.content as string,
      );
      const edgeData: string[] = edgeCsv.map(
        (attachment: TFileContent) => attachment.content as string,
      );

      const graphData = await processPreviewNodeEdge(nodeData, edgeData);

      const actions = [
        setDataPreview(graphData),
        setIsEdgeGroupable(true),
        setError(null),
        setStep(2),
      ];

      // @ts-ignore
      await store.dispatch(previewNodeEdge(multipleNodeEdgeData));
      expect(store.getActions()).toEqual(actions);
    });

    it('should display error message when import restricted datasets', async () => {
      const actions = [setError('restricted-words')];

      // @ts-ignore
      await store.dispatch(previewNodeEdge(restrictedNodeEdge));
      expect(store.getActions()).toEqual(actions);
    });
  });
});
