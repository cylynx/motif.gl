import configureStore from 'redux-mock-store';
import cloneDeep from 'lodash/cloneDeep';
import thunk from 'redux-thunk';
import * as T from '../../../graph/types';
import * as FileUploadT from '../types';
import * as previewThunk from '../thunk';
import * as previewSlice from '../slice';
import { initialState } from '../slice';
import { MotifUploadError } from '../../../../components/ImportErrorMessage';

import emptyDataJson from './constant/negative/json/02-empty-data.json';
import nodeRestrictedAttr from './constant/negative/json/04-node-restricted-attributes.json';
import edgeRestrictedArr from './constant/negative/json/05-edge-restricted-attributes.json';
import missingNodeEdge from './constant/negative/json/03-missing-nodes-or-edges.json';

import * as edgeListCsv from './constant/negative/edgeListCsv';
import * as nodeEdgeCsv from './constant/negative/nodeEdgeCsv';

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

describe('Upload Errors', () => {
  const store = mockStore(getStore());

  afterEach(() => {
    store.clearActions();
  });
  // node attributes contain restricted words
  describe('JSON', () => {
    it('Node Restricted Words', async () => {
      const content = nodeRestrictedAttr as never as T.GraphData;
      const attachments = [
        {
          fileName: 'node-restricted-attributes.json',
          content,
        },
      ];

      const execution = previewThunk.previewJson(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('node-restricted-words');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });

    // edge attributes contain restricted words
    it('Edge Restricted Words', async () => {
      const content = edgeRestrictedArr as never as T.GraphData;
      const attachments = [
        {
          fileName: 'edge-restricted-attributes.json',
          content,
        },
      ];

      const execution = previewThunk.previewJson(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('edge-restricted-words');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });

    // provided attachment are empty datasets
    it('Empty Datasets', async () => {
      const content = emptyDataJson.data as never as T.GraphList;
      const attachments = [
        {
          fileName: 'empty-data.json',
          content,
        },
      ];

      const execution = previewThunk.previewJson(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('empty-dataset');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });

    it('Missing Node or Edge', async () => {
      const content = missingNodeEdge.data as never as T.GraphList;
      const attachments = [
        {
          fileName: 'missing-node-edge.json',
          content,
        },
      ];

      const execution = previewThunk.previewJson(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('missing-nodes-or-edges');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });
  });

  describe('Edge List CSV', () => {
    // uploaded csv format is invalid.
    it('Invalid CSV Format', async () => {
      const content: string = edgeListCsv.invalidFormat;
      const attachments = [
        {
          fileName: 'invalid-format.csv',
          content,
        },
      ];

      const execution = previewThunk.previewEdgeList(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('empty-dataset');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });

    // provided csv row is empty.
    it('Empty CSV Row', async () => {
      const content: string = edgeListCsv.emptyEdge;
      const attachments = [
        {
          fileName: 'empty-edge.csv',
          content,
        },
      ];

      const execution = previewThunk.previewEdgeList(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('empty-csv-row');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });

    // edge attributes contain restricted words
    it('Edge Restricted Words', async () => {
      const content: string = edgeListCsv.invalidEdgeRestrictedType;
      const attachments = [
        {
          fileName: 'invalid-edge-restricted-type.csv',
          content,
        },
      ];

      const execution = previewThunk.previewEdgeList(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('edge-restricted-words');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });
  });

  describe('Node Edge CSV', () => {
    // node attributes contain restricted words
    it('Node Restricted Words', async () => {
      const attachments: FileUploadT.SingleFileForms = {
        nodeCsv: [
          {
            fileName: 'node-restricted-type.csv',
            content: nodeEdgeCsv.nodeRestricted,
          },
        ],
        edgeCsv: [
          {
            fileName: 'sample-edge.csv',
            content: nodeEdgeCsv.sampleEdge,
          },
        ],
      };

      const execution = previewThunk.previewNodeEdge(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('node-restricted-words');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });

    // edge attributes contain restricted words
    it('Edge Restricted Words', async () => {
      const attachments: FileUploadT.SingleFileForms = {
        nodeCsv: [
          {
            fileName: 'sample-node.csv',
            content: nodeEdgeCsv.sampleNode,
          },
        ],
        edgeCsv: [
          {
            fileName: 'edge-restricted-type.csv',
            content: nodeEdgeCsv.edgeRestricted,
          },
        ],
      };

      const execution = previewThunk.previewNodeEdge(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('edge-restricted-words');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });

    // the uplaoded node csv format is invalid
    it('Invalid Node CSV Format', async () => {
      const attachments: FileUploadT.SingleFileForms = {
        nodeCsv: [
          {
            fileName: 'invalid-node.csv',
            content: nodeEdgeCsv.invalidNode,
          },
        ],
        edgeCsv: [
          {
            fileName: 'edge-restricted-type.csv',
            content: nodeEdgeCsv.edgeRestricted,
          },
        ],
      };

      const execution = previewThunk.previewNodeEdge(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('invalid-node-csv-format');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });

    // the uplaoded edge csv format is invalid
    it('Invalid Edge CSV Format', async () => {
      const attachments: FileUploadT.SingleFileForms = {
        nodeCsv: [
          {
            fileName: 'sample-node.csv',
            content: nodeEdgeCsv.sampleNode,
          },
        ],
        edgeCsv: [
          {
            fileName: 'invalid-edge.csv',
            content: nodeEdgeCsv.invalidEdge,
          },
        ],
      };

      const execution = previewThunk.previewNodeEdge(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('invalid-edge-csv-format');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });

    // provided node csv row is empty.
    it('Empty Node CSV Row', async () => {
      const attachments: FileUploadT.SingleFileForms = {
        nodeCsv: [
          {
            fileName: 'empty-node.csv',
            content: nodeEdgeCsv.emptyNodeRow,
          },
        ],
        edgeCsv: [
          {
            fileName: 'invalid-edge.csv',
            content: nodeEdgeCsv.sampleEdge,
          },
        ],
      };

      const execution = previewThunk.previewNodeEdge(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('empty-node-csv-row');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });

    // provided edge csv row is empty.
    it('Empty Edge CSV Row', async () => {
      const attachments: FileUploadT.SingleFileForms = {
        nodeCsv: [
          {
            fileName: 'sample-node.csv',
            content: nodeEdgeCsv.sampleNode,
          },
        ],
        edgeCsv: [
          {
            fileName: 'empty-edge-row.csv',
            content: nodeEdgeCsv.emptyEdgeRow,
          },
        ],
      };

      const execution = previewThunk.previewNodeEdge(attachments) as any;
      await store.dispatch(execution);

      const error = new MotifUploadError('empty-edge-csv-row');
      const results = [previewSlice.setError(error)];

      expect(store.getActions()).toEqual(results);
    });
  });
});
