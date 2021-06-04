import { combineReducers } from '@reduxjs/toolkit';
import { TFileContentState } from '../types';
import investigateReducer from '../../../investigate';
import { getFileUpload } from '../selectors';

const clientReducer = combineReducers({
  investigate: investigateReducer,
});

describe('getFileUpload', () => {
  const fileUploadSlice: TFileContentState = {
    step: 1,
    attachments: [],
    dataType: 'json',
    accessors: {
      nodeID: 'id',
      edgeID: 'id',
      edgeSource: 'source',
      edgeTarget: 'target',
    },
    groupEdge: true,
    dataPreview: {
      nodes: [],
      edges: [],
      metadata: { fields: { nodes: [], edges: [] } },
    },
    isEdgeGroupable: false,
    error: null,
  };

  let reducer: any;
  beforeEach(() => {
    reducer = clientReducer(
      {
        // @ts-ignore
        investigate: {
          import: {
            fileUpload: fileUploadSlice,
          },
        },
      },
      {},
    );
  });

  it('should obtain the fileUpload object', () => {
    const results: TFileContentState = getFileUpload(reducer);
    expect(results).toEqual(fileUploadSlice);
  });

  afterEach(() => {
    reducer = null;
  });
});
