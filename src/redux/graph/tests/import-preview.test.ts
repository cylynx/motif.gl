import {
  processPreviewJson,
  processPreviewEdgeList,
  processPreviewNodeEdge,
} from '../processors/import-preview';
import { Node } from '../types';

describe('processPreviewJson', () => {
  const sampleData = {
    nodes: [{ id: '1' }, { id: '2' }, { id: '3' }],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '1', target: '2' },
      { id: 'e3', source: '2', target: '3' },
    ],
  };

  const expectedResults = {
    nodes: [{ id: 1 }, { id: 2 }, { id: 3 }],
    edges: [
      { id: 'e1', source: 1, target: 2 },
      { id: 'e2', source: 1, target: 2 },
      { id: 'e3', source: 2, target: 3 },
    ],
  };

  it('should preview GraphData accurately', async () => {
    const json = sampleData;
    const groupEdges = false;

    const results = await processPreviewJson(json, groupEdges);

    results.forEach((result) => {
      const { nodes, edges, metadata } = result;
      expect(nodes).toEqual(expectedResults.nodes);
      expect(edges).toEqual(expectedResults.edges);
      expect(metadata.groupEdges.toggle).toEqual(groupEdges);
    });
  });

  it('should preview GraphList accurately', async () => {
    const json = [sampleData, sampleData];
    const groupEdges = false;

    const results = await processPreviewJson(json, groupEdges);

    results.forEach((result) => {
      const { nodes, edges, metadata } = result;
      expect(nodes).toEqual(expectedResults.nodes);
      expect(edges).toEqual(expectedResults.edges);
      expect(metadata.groupEdges.toggle).toEqual(groupEdges);
    });
  });

  it('should preview data with group edges', async () => {
    const json = sampleData;
    const groupEdges = true;

    const results = await processPreviewJson(json, groupEdges);

    results.forEach((result) => {
      const { nodes, edges, metadata } = result;
      expect(nodes).toEqual(expectedResults.nodes);
      expect(edges).toEqual(expectedResults.edges);
      expect(metadata.groupEdges.toggle).toEqual(groupEdges);
    });
  });
});

describe('processPreviewEdgeList', () => {
  const edgeListCsv = `custom_id,data.value,data.blk_ts_unix,from,to\n1,100,NaN,a,b\n2,200,2000000,b,c\n3,300,Null,c,b`;
  it('should preview csv successfully', async () => {
    const results = await processPreviewEdgeList(edgeListCsv);

    const expectedResults = {
      edges: [
        {
          custom_id: 1,
          data: { blk_ts_unix: null, value: 100 },
          from: 'a',
          to: 'b',
        },
        {
          custom_id: 2,
          data: { blk_ts_unix: 2000000, value: 200 },
          from: 'b',
          to: 'c',
        },
        {
          custom_id: 3,
          data: { blk_ts_unix: null, value: 300 },
          from: 'c',
          to: 'b',
        },
      ],
      metadata: {
        fields: {
          edges: [
            {
              analyzerType: 'INT',
              format: '',
              name: 'custom_id',
              type: 'integer',
            },
            {
              analyzerType: 'INT',
              format: '',
              name: 'data.value',
              type: 'integer',
            },
            {
              analyzerType: 'INT',
              format: '',
              name: 'data.blk_ts_unix',
              type: 'integer',
            },
            {
              analyzerType: 'STRING',
              format: '',
              name: 'from',
              type: 'string',
            },
            { analyzerType: 'STRING', format: '', name: 'to', type: 'string' },
          ],
          nodes: [] as Node[],
        },
        groupEdges: { availability: true, toggle: false },
        key: 'preview-edge-list',
      },
      nodes: [] as Node[],
    };

    expect(results).toEqual(expectedResults);
  });
});

describe('processPreviewNodeEdge', () => {
  const nodeCsv = `id,data.value\na,100\nb,200\nc,300`;
  const edgeCsv = `id,data.value,data.blk_ts_unix,source,target,style.keyshape.endArrow
txn a-b,100,NaN,a,b,true
txn b-c,200,2000000,b,c,true
txn c-b,300,Null,c,b,true
`;
  it('should preview graph successfully', async () => {
    const nodeCsvs = [nodeCsv];
    const edgeCsvs = [edgeCsv];

    const results = await processPreviewNodeEdge(nodeCsvs, edgeCsvs);

    const expectedOutput = {
      edges: [
        {
          data: { blk_ts_unix: null, value: 100 },
          id: 'txn a-b',
          source: 'a',
          style: { keyshape: { endArrow: true } },
          target: 'b',
        },
        {
          data: { blk_ts_unix: 2000000, value: 200 },
          id: 'txn b-c',
          source: 'b',
          style: { keyshape: { endArrow: true } },
          target: 'c',
        },
        {
          data: { blk_ts_unix: null, value: 300 },
          id: 'txn c-b',
          source: 'c',
          style: { keyshape: { endArrow: true } },
          target: 'b',
        },
      ],
      metadata: {
        fields: {
          edges: [
            { analyzerType: 'STRING', format: '', name: 'id', type: 'string' },
            {
              analyzerType: 'INT',
              format: '',
              name: 'data.value',
              type: 'integer',
            },
            {
              analyzerType: 'INT',
              format: '',
              name: 'data.blk_ts_unix',
              type: 'integer',
            },
            {
              analyzerType: 'STRING',
              format: '',
              name: 'source',
              type: 'string',
            },
            {
              analyzerType: 'STRING',
              format: '',
              name: 'target',
              type: 'string',
            },
          ],
          nodes: [
            { analyzerType: 'STRING', format: '', name: 'id', type: 'string' },
            {
              analyzerType: 'INT',
              format: '',
              name: 'data.value',
              type: 'integer',
            },
          ],
        },
        groupEdges: { availability: false, toggle: false },
        key: 'preview-node-edge',
      },
      nodes: [
        { data: { value: 100 }, id: 'a' },
        { data: { value: 200 }, id: 'b' },
        { data: { value: 300 }, id: 'c' },
      ],
    };

    expect(results).toEqual(expectedOutput);
  });
});
