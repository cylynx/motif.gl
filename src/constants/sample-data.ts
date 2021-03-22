/* eslint-disable no-restricted-properties */
/* eslint-disable no-param-reassign */

import { EdgeStyle, Utils, IUserNode, IUserEdge } from '@antv/graphin';
import { GraphData, GraphList } from '../redux/graph';
import {
  mapNodeSize,
  styleNodeSize,
} from '../containers/Graph/styles/StyleNodes';
import { DEFAULT_EDGE_STYLE } from './graph-shapes';

export const RandomData = () => {
  const data: GraphData = Utils.mock(15)
    .random()
    .graphin();
  data.nodes.forEach((n: IUserNode) => {
    n.numeric = Math.floor(Math.random() * 100 + 1);
    delete n.type;
    delete n.style;
  });

  data.metadata = {
    title: 'Random Data',
  };
  return data;
};
export const CircleData = () => {
  const data: GraphData = Utils.mock(10)
    .circle()
    .graphin();

  data.nodes.forEach((n) => {
    delete n.type;
    delete n.style;
  });

  data.edges.forEach((e) => {
    e.numeric = Math.floor(Math.random() * 10 + 1);
  });

  data.metadata = {
    title: 'Circle Data',
  };
  return data;
};

export const TwoDataArray = () => [RandomData(), CircleData()];

export const SimpleEdge = (): GraphData => ({
  nodes: [
    {
      id: '1',
    },
    {
      id: '2',
    },
  ],
  edges: [
    {
      id: 'txn a-b',
      source: '1',
      target: '2',
    },
  ],
  metadata: {
    key: 123,
  },
});

/**
 * This dataset is used by test case.
 * @constructor
 */
export const TriangleJSON = (): GraphList => [
  {
    nodes: [
      {
        id: 'a',
        data: {
          category: 'Other',
          created_ts_unix: 1557191325000,
        },
        label: 'Node 1',
        style: {
          keyshape: {
            size: 20,
            fill: '#008080',
          },
        },
      },
      {
        id: 'b',
        data: {
          category: 'Other',
          created_ts_unix: 1558371616000,
        },
        label: 'Node 2',
        style: {
          keyshape: {
            size: 20,
            fill: '#008080',
          },
        },
      },
      {
        id: 'c',
        data: {
          category: 'Other',
          created_ts_unix: 1558371616000,
        },
        label: 'Node 3',
        style: {
          keyshape: {
            size: 20,
            fill: '#008080',
          },
        },
      },
    ],
    edges: [
      {
        id: 'txn a-b',
        data: {
          value: 100,
          blk_ts_unix: 1000000,
        },
        source: 'a',
        target: 'b',
        style: {
          keyshape: {
            endArrow: DEFAULT_EDGE_STYLE.keyshape.endArrow,
          },
        },
      },
      {
        id: 'txn b-c',
        data: {
          value: 200,
          blk_ts_unix: 2000000,
        },
        source: 'b',
        target: 'c',
        style: {
          keyshape: {
            endArrow: DEFAULT_EDGE_STYLE.keyshape.endArrow,
          },
        },
      },
      {
        id: 'txn c-b',
        data: {
          value: 300,
          blk_ts_unix: 3000000,
        },
        source: 'c',
        target: 'b',
        style: {
          keyshape: {
            endArrow: DEFAULT_EDGE_STYLE.keyshape.endArrow,
          },
        },
      },
    ],
    metadata: {
      key: 1592981050812,
    },
  },
];

export const BankData = (): Promise<GraphData> =>
  fetch(
    'https://storage.googleapis.com/cylynx-landing-content/banking-connections-demo.json',
  )
    .then((res) => res.json())
    .then((data: GraphData) => {
      Object.assign(data[0].metadata, {
        title: 'Banking Connections',
      });

      return data;
    });

export const MiserablesData = () =>
  fetch(
    'https://gist.githubusercontent.com/emanueles/1dc73efc65b830f111723e7b877efdd5/raw/2c7a42b5d27789d74c8708e13ed327dc52802ec6/lesmiserables.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const { nodes, links } = data;
      const newData: GraphData = {
        nodes,
        edges: links,
        metadata: {
          title: 'Les Miserables',
        },
      };

      return newData;
    });

export const NetworkData = () =>
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/da5a1b47-37d6-44d7-8d10-f3e046dabf82.json',
  )
    .then((res) => res.json())
    .then((data) => {
      data.nodes.forEach((node: IUserNode) => {
        node.degree = 0;
        node.style = {};
        styleNodeSize(node.style, 6);

        data.edges.forEach((edge: IUserEdge) => {
          if (edge.source === node.id || edge.target === node.id) {
            node.degree++;
          }
        });
      });
      mapNodeSize(data.nodes, 'degree', [1, 10]);
      data.metadata = {
        title: 'Network Data',
      };
      return data;
    });

export const AAData = () => {
  return fetch(
    'https://gw.alipayobjects.com/os/basement_prod/7ba82250-8367-4351-82b2-d48604cd2261.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const { nodes, edges } = data;
      nodes.forEach((n: IUserNode) => {
        n.style = {};
        n.y = -n.y + 1000;
        n.x += 2000;
        n.degree = 0;
        n.inDegree = 0;
        n.outDegree = 0;
      });
      // compute the degree of each node
      const nodeIdMap = new Map();
      nodes.forEach((node: IUserNode) => {
        nodeIdMap.set(node.id, node);
      });
      edges.forEach((e: IUserEdge) => {
        const source = nodeIdMap.get(e.source);
        const target = nodeIdMap.get(e.target);
        const keyshape: Partial<EdgeStyle>['keyshape'] = {};
        source.outDegree++;
        target.inDegree++;
        source.degree++;
        target.degree++;
        e.style = {};
        Object.assign(keyshape, {
          lineWidth: 0.3,
          stroke: 'grey',
        });
      });
      mapNodeSize(nodes, 'degree', [2, 20]);
      data.metadata = {
        title: "Airline's Data",
      };
      return data;
    });
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
