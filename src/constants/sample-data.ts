/* eslint-disable no-restricted-properties */
/* eslint-disable no-param-reassign */
// @ts-nocheck
import mock from '../utils/mock';
import * as Graph from '../types/Graph';

export const RandomData = () => mock(15).random().graphin();
export const CircleData = () => mock(10).circle().graphin();

const mapNodeSize = (nodes, propertyName, visualRange) => {
  let minp = 9999999999;
  let maxp = -9999999999;
  nodes.forEach((node) => {
    node[propertyName] = Math.pow(node[propertyName], 1 / 3);
    minp = node[propertyName] < minp ? node[propertyName] : minp;
    maxp = node[propertyName] > maxp ? node[propertyName] : maxp;
  });
  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];
  nodes.forEach((node) => {
    node.style = {
      nodeSize:
        ((node[propertyName] - minp) / rangepLength) * rangevLength +
        visualRange[0],
    };
  });
};

export const TwoDataArray = () => [RandomData(), CircleData()];

export const SimpleEdge = (): Graph.GraphData => ({
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

export const TriangleJSON = (): Graph.GraphList => [
  {
    nodes: [
      {
        id: 'a',
        data: {
          category: 'Other',
          created_ts_unix: 1557191325000,
        },
        label: 'Node 1',
        style: { nodeSize: 20, primaryColor: '#008080' },
      },
      {
        id: 'b',
        data: {
          category: 'Other',
          created_ts_unix: 1558371616000,
        },
        label: 'Node 2',
        style: { nodeSize: 20, primaryColor: '#008080' },
      },
      {
        id: 'c',
        data: {
          category: 'Other',
          created_ts_unix: 1558371616000,
        },
        label: 'Node 3',
        style: { nodeSize: 20, primaryColor: '#008080' },
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
        style: { endArrow: true },
      },
      {
        id: 'txn b-c',
        data: {
          value: 200,
          blk_ts_unix: 2000000,
        },
        source: 'b',
        target: 'c',
        style: { endArrow: true },
      },
      {
        id: 'txn c-b',
        data: {
          value: 300,
          blk_ts_unix: 3000000,
        },
        source: 'c',
        target: 'b',
        style: { endArrow: true },
      },
    ],
    metadata: {
      key: 1592981050812,
    },
  },
];

export const NetworkData = () =>
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/da5a1b47-37d6-44d7-8d10-f3e046dabf82.json',
  )
    .then((res) => res.json())
    .then((data) => {
      data.nodes.forEach((node) => {
        node.label = node.olabel;
        node.degree = 0;
        data.edges.forEach((edge) => {
          if (edge.source === node.id || edge.target === node.id) {
            node.degree++;
          }
        });
      });
      mapNodeSize(data.nodes, 'degree', [1, 10]);
      return data;
    });

export const txnJSON: Graph.GraphList = [
  {
    nodes: [
      {
        id: 'address/82574506',
        data: {
          category: 'Other',
          _key: '82574506',
          _id: 'address/82574506',
          address: '0xd96ba527be241c2c31fd66cbb0a9430702906a2a',
          created_ts_unix: 1557191325000,
        },
        label: 'd96ba...',
        style: { nodeSize: 20, primaryColor: '#008080' },
      },
      {
        id: 'address/83923613',
        data: {
          category: 'Other',
          _key: '83923613',
          _id: 'address/83923613',
          address: '0xd4e79226f1e5a7a28abb58f4704e53cd364e8d11',
          created_ts_unix: 1558371616000,
        },
        label: 'd4e79...',
        style: { nodeSize: 20, primaryColor: '#008080' },
      },
    ],
    edges: [
      {
        id: 'transaction/288844035',
        data: {
          _from: 'address/82574506',
          _id: 'transaction/288844035',
          _key: '288844035',
          _to: 'address/83923613',
          blk_num: 7798067,
          blk_ts_unix: 1558371817000,
          score_vector: [
            2.4669448502752394e-8,
            0.0000015858786746827042,
            3.6277524748966577e-12,
            2.5527963821404863e-9,
            0.00002864326272102155,
            7.723923637444402e-9,
            4.003233853929708e-9,
            0.9999675128859348,
            1.5164078785901573e-9,
            3.9248534715014887e-7,
            0.0000016792011583752624,
            3.683347536863764e-8,
            1.7903039945332553e-9,
            8.348233243778563e-11,
            1.0710946419298142e-7,
          ],
          trace_addr: '-1',
          txn_hash:
            '0x9969ca31352a32f796320dac61594bca629f3b8a709ac7a8e40439fb74444624',
          value: 10000,
          to_address: '0xd4e79226f1e5a7a28abb58f4704e53cd364e8d11',
          from_address: '0xd96ba527be241c2c31fd66cbb0a9430702906a2a',
        },
        source: 'address/82574506',
        target: 'address/83923613',
        label: '1.00e+4',
        title: '1.00e+4 ETH',
        style: { endArrow: 'true' },
      },
    ],
    metadata: {
      search_size: 1,
      retrieved_size: 1,
      title: 'Txn 9969c',
      key: 1592981050812,
    },
  },
];
