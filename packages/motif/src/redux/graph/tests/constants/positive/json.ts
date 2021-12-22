import * as LAYOUT from '../../../../../constants/layout-options';
import { DEFAULT_NODE_STYLE } from '../../../../../constants/graph-shapes';
import { GraphData } from '../../..';

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

export const sampleGraphFlatten: GraphData = {
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
};

export const graphWithFilter = {
  data: [
    {
      nodes: [
        { id: 'node-0', label: 'node-0' },
        { id: 'node-1', label: 'node-1' },
        { id: 'node-2', label: 'node-2' },
        { id: 'node-3', label: 'node-3' },
        { id: 'node-4', label: 'node-4' },
        { id: 'node-5', label: 'node-5' },
        { id: 'node-6', label: 'node-6' },
        { id: 'node-7', label: 'node-7' },
        { id: 'node-8', label: 'node-8' },
        { id: 'node-9', label: 'node-9' },
      ],
      edges: [
        { source: 'node-0', target: 'node-0', numeric: 2, id: 'l5O4mnNhR5' },
        { source: 'node-0', target: 'node-1', numeric: 10, id: '64l4IOP-qf' },
        { source: 'node-0', target: 'node-2', numeric: 7, id: 'lj01TmTzLy' },
        { source: 'node-0', target: 'node-3', numeric: 9, id: 'mCpGU2GpGl' },
        { source: 'node-0', target: 'node-4', numeric: 6, id: 'YzhGFuNL_c' },
        { source: 'node-0', target: 'node-5', numeric: 4, id: 'M_xjfLXSsH' },
        { source: 'node-0', target: 'node-6', numeric: 6, id: 'Puxu6Q0ZIW' },
        { source: 'node-0', target: 'node-7', numeric: 1, id: 'BJb1lYPq6_' },
        { source: 'node-0', target: 'node-8', numeric: 9, id: 'IbLAWDjY-T' },
        { source: 'node-1', target: 'node-0', numeric: 8, id: 'Q-3JBeWh_I' },
        { source: 'node-2', target: 'node-0', numeric: 5, id: 'ic19cuNzLI' },
        { source: 'node-3', target: 'node-0', numeric: 6, id: 'UYWF5odnoI' },
        { source: 'node-4', target: 'node-0', numeric: 2, id: '4IWQ5BJ-p9' },
        { source: 'node-5', target: 'node-0', numeric: 4, id: 'uB6DGIRXSw' },
        { source: 'node-6', target: 'node-0', numeric: 3, id: 'G8LkkiRv5X' },
        { source: 'node-7', target: 'node-0', numeric: 7, id: 'tZzIzcOeErQ' },
        { source: 'node-8', target: 'node-0', numeric: 4, id: 'xsW6KdHI41O' },
        { source: 'node-9', target: 'node-0', numeric: 7, id: 'CtUMCSLt1HH' },
      ],
      metadata: {
        title: 'Circle Data',
        fields: {
          nodes: [
            { name: 'id', format: '', type: 'string', analyzerType: 'STRING' },
            {
              name: 'label',
              format: '',
              type: 'string',
              analyzerType: 'STRING',
            },
          ],
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
              name: 'numeric',
              format: '',
              type: 'integer',
              analyzerType: 'INT',
            },
            { name: 'id', format: '', type: 'string', analyzerType: 'STRING' },
          ],
        },
        key: 'ius8Qbjao',
        groupEdges: { toggle: false, availability: false },
      },
    },
  ],
  style: {
    layout: {
      type: 'concentric',
      minNodeSpacing: 50,
      sortBy: 'degree',
      preventOverlap: true,
      workerEnabled: true,
    },
    nodeStyle: {
      color: { value: 'green', id: 'fixed' },
      size: { id: 'fixed', value: 20 },
    },
    edgeStyle: { width: { id: 'fixed', value: 1 } },
  },
  filter: {
    '6gTFk8X0Q': {
      id: 'id',
      from: 'nodes',
      selection: [
        {
          id: 'id',
          label: 'id',
          type: 'string',
          analyzerType: 'STRING',
          format: '',
          from: 'nodes',
          optionKey: 'nodes-id',
          __optgroup: 'Nodes',
        },
      ],
      analyzerType: 'STRING',
      isFilterReady: true,
      stringOptions: [
        { id: 'node-0', label: 'node-0' },
        { id: 'node-1', label: 'node-1' },
        { id: 'node-2', label: 'node-2' },
        { id: 'node-3', label: 'node-3' },
        { id: 'node-4', label: 'node-4' },
        { id: 'node-5', label: 'node-5' },
        { id: 'node-6', label: 'node-6' },
        { id: 'node-7', label: 'node-7' },
        { id: 'node-8', label: 'node-8' },
        { id: 'node-9', label: 'node-9' },
      ],
      caseSearch: [
        { id: 'node-1', label: 'node-1' },
        { id: 'node-0', label: 'node-0' },
        { id: 'node-3', label: 'node-3' },
        { id: 'node-4', label: 'node-4' },
        { id: 'node-5', label: 'node-5' },
        { id: 'node-2', label: 'node-2' },
      ],
    },
  },
};

export const sampleNodeColourMap = {
  color: {
    variable: 'label',
    id: 'legend',
    mapping: {
      'node-0': '#4e79a7',
      'node-1': '#f28e2c',
      'node-2': '#e15759',
      'node-3': '#76b7b2',
      'node-4': '#59a14f',
      'node-5': '#edc949',
      'node-6': '#af7aa1',
      'node-7': '#ff9da7',
      'node-8': '#9c755f',
      'node-9': '#9c755f',
    },
  },
  size: { id: 'fixed', value: 20 },
  variable: 'label',
};

export const sampleEdgeColourMap = {
  color: {
    variable: 'source',
    id: 'legend',
    mapping: {
      'node-0': '#4e79a7',
      'node-1': '#f28e2c',
      'node-2': '#e15759',
      'node-3': '#76b7b2',
      'node-4': '#59a14f',
      'node-5': '#edc949',
      'node-6': '#af7aa1',
      'node-7': '#ff9da7',
      'node-8': '#9c755f',
      'node-9': '#9c755f',
    },
  },
};
