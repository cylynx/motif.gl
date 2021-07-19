import * as LAYOUT from '../../../constants/layout-options';
import { DEFAULT_NODE_STYLE } from '../../../constants/graph-shapes';
import { GraphList } from '../types';
import { GraphData } from '..';

export const whitespaceNodeEdge = {
  edgeCsv: [
    {
      fileName: 'test-1.csv',
      content:
        'id,relation,source,target\ntxn1,hello,   a,b   \ntxn2,works,b  ,c \ntxn3,abc,c  ,  a',
    },
  ],
  nodeCsv: [
    {
      fileName: 'test-2.csv',
      content: 'id,value,score\n   a,20,80\nb   ,40,100\n   c,60,123',
    },
  ],
};

export const numericAccessorsNodeEdge = {
  edgeCsv: [
    {
      fileName: 'numeric-accessors-1.csv',
      content:
        'id,relation,numeric_source,numeric_target\ntxn1,hello,1,2\ntxn2,works,2,3\ntxn3,abc,3,1\n',
    },
  ],
  nodeCsv: [
    {
      fileName: 'numeric-accessors-2.csv',
      content: 'custom_id,value,score\n1,20,80\n2,40,100\n3,60,123',
    },
  ],
};

export const sampleJson1 = {
  nodes: [
    {
      id: 'node-1',
      node1: '1',
    },
    {
      id: 'node-2',
      node1: '2',
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      edge1: '1',
    },
    {
      id: 'edge-2',
      source: 'node-2',
      target: 'node-1',
      edge1: '2',
    },
  ],
};

export const sampleJson2 = {
  nodes: [
    {
      id: 'node-1',
      node2: '1',
    },
    {
      id: 'node-2',
      node2: '2',
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      edge2: '1',
    },
    {
      id: 'edge-2',
      source: 'node-2',
      target: 'node-1',
      edge2: '2',
    },
  ],
};

export const jsonDataOne = {
  data: {
    nodes: [{ id: 'node-1' }, { id: 'node-2' }],
    edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
    metadata: {
      key: 123,
    },
  },
  style: {
    layout: LAYOUT.RADIAL_DEFAULT,
    nodeStyle: {
      color: {
        id: 'fixed',
        value: DEFAULT_NODE_STYLE.color,
      },
      size: {
        id: 'fixed',
        value: 30,
      },
    },
    edgeStyle: {
      width: {
        id: 'fixed',
        value: 2,
      },
      label: 'none',
    },
  },
};

export const jsonDataTwo = {
  data: {
    nodes: [{ id: 'node-3' }, { id: 'node-4' }],
    edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
    metadata: {
      key: 234,
    },
  },
  style: {
    layout: { type: 'graphin-force' },
    nodeStyle: {
      color: { value: 'orange', id: 'fixed' },
      size: { value: 47, id: 'fixed' },
      label: 'id',
    },
    edgeStyle: {
      width: { id: 'fixed', value: 1 },
      label: 'source',
      pattern: 'dot',
      fontSize: 16,
      arrow: 'none',
    },
  },
};

export const simpleGraphOne = {
  data: {
    nodes: [{ id: 'node-3' }, { id: 'node-4' }],
    edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
    metadata: {
      key: 234,
    },
    key: 234,
  },
};

export const simpleGraphTwo = {
  data: [
    {
      nodes: [{ id: 'node-3' }, { id: 'node-4' }],
      edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
      metadata: {
        key: 234,
      },
    },
    {
      nodes: [{ id: 'node-1' }, { id: 'node-2' }],
      edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
      metadata: {
        key: 123,
      },
    },
  ],
};

export const simpleGraphThree = {
  data: [
    {
      nodes: [{ custom_id: 1 }, { custom_id: 2 }],
      edges: [{ id: 'custom-edge', custom_source: 2, custom_target: 1 }],
      metadata: {
        key: 234,
      },
    },
  ],
};

export const simpleGraphWithGroupEdge = {
  data: {
    nodes: [{ id: 'node-3' }, { id: 'node-4' }],
    edges: [
      { id: 'edge-2', source: 'node-3', target: 'node-4' },
      { id: 'edge-3', source: 'node-3', target: 'node-4' },
    ],
    metadata: {
      key: 234,
    },
  },
};

export const SimpleGraphWithGroupEdge = (): GraphData => ({
  nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
  edges: [
    {
      source: 'a',
      target: 'b',
      id: 'a-b1',
      numeric: 1,
      value: 'first',
      date: '19-05-1996',
    },
    {
      source: 'a',
      target: 'b',
      id: 'a-b2',
      numeric: 2,
      value: 'Last',
      date: '20-05-1996',
    },
    {
      source: 'a',
      target: 'b',
      id: 'a-b3',
      numeric: 2,
      value: 'last',
      date: '20-05-1996',
    },
    { source: 'a', target: 'b', id: 'a-b4' },
    {
      source: 'a',
      target: 'b',
      id: 'a-b5',
      value: 'last',
      date: '21-05-1996',
    },
    { source: 'c', target: 'd', id: 'c-d1', numeric: 1 },
    { source: 'c', target: 'd', id: 'c-d2', numeric: 2 },
    { source: 'c', target: 'd', id: 'c-d3', numeric: 2 },
    { source: 'c', target: 'd', id: 'c-d4' },
  ],
  metadata: {
    key: 'QoFR2RwSM',
    fields: {
      nodes: [
        {
          name: 'id',
          format: '',
          type: 'string',
          analyzerType: 'string',
        },
      ],
      edges: [
        {
          name: 'id',
          format: '',
          type: 'string',
          analyzerType: 'string',
        },
        {
          name: 'source',
          format: '',
          type: 'string',
          analyzerType: 'string',
        },
        {
          name: 'target',
          format: '',
          type: 'string',
          analyzerType: 'string',
        },
        {
          name: 'numeric',
          format: '',
          type: 'integer',
          analyzerType: 'INT',
        },
        {
          name: 'value',
          format: '',
          type: 'string',
          analyzerType: 'STRING',
        },
        {
          name: 'date',
          format: '',
          type: 'string',
          analyzerType: 'STRING',
        },
      ],
    },
    groupEdges: {
      toggle: true,
      availability: true,
      type: 'numeric',
      fields: {
        'Y_-ZK2S3P': {
          field: 'numeric',
          aggregation: ['min', 'max', 'average', 'count', 'sum'],
        },
        _8X9zGku9b: {
          field: 'value',
          aggregation: ['first', 'last', 'most_frequent'],
        },
        vVENjKDSxE: {
          field: 'date',
          aggregation: ['first', 'last', 'most_frequent'],
        },
      },
    },
  },
});

export const graphWithGroupEdge = {
  nodes: [{ id: 'a' }, { id: 'b' }],
  edges: [
    {
      id: 'a-b1',
      source: 'a',
      target: 'b',
      Value: 300000,
      TokenName: 'Tether USD',
    },
    {
      id: 'a-b2',
      source: 'a',
      target: 'b',
      Value: 300000,
      TokenName: 'Tether USD',
    },
    {
      id: 'a-b3',
      source: 'a',
      target: 'b',
      Value: 147000,
      TokenName: 'ETH',
    },
    {
      id: 'a-b4',
      source: 'a',
      target: 'b',
      Value: 38000,
      TokenName: 'Tether USD',
    },
    {
      id: 'a-b5',
      source: 'a',
      target: 'b',
      Value: 31000,
      TokenName: 'Tether USD',
    },
  ],
  metadata: {
    fields: {
      // @ts-ignore
      nodes: [],
      edges: [
        {
          name: 'source',
          format: '',
          type: 'string',
          analyzerType: 'STRING',
        },
        {
          name: 'target',
          format: '',
          type: 'string',
          analyzerType: 'STRING',
        },
        {
          name: 'Value',
          format: '',
          type: 'integer',
          analyzerType: 'INT',
        },
        {
          name: 'TokenName',
          format: '',
          type: 'string',
          analyzerType: 'STRING',
        },
      ],
    },
    groupEdges: {
      toggle: true,
      availability: true,
      type: 'TokenName',
      fields: {
        Or2fv2L2W: {
          field: 'Value',
          aggregation: ['count', 'sum', 'max'],
        },
        Sfdjksdf2: {
          field: 'TokenName',
          aggregation: ['first', 'last', 'most_frequent'],
        },
      },
    },
  },
};
