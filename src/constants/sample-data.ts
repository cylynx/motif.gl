/* eslint-disable no-restricted-properties */
/* eslint-disable no-param-reassign */
// @ts-nocheck
import mock from '../utils/mock';
import * as Graph from '../containers/Graph/types';

export const RandomData = () => {
  const data = mock(15).random().graphin();
  data.nodes.forEach((n) => {
    n.numeric = Math.floor(Math.random() * 100 + 1);
  });

  data.metadata = {
    title: 'Random Data',
  };
  return data;
};
export const CircleData = () => {
  const data = mock(10).circle().graphin();
  data.edges.forEach((e) => {
    e.numeric = Math.floor(Math.random() * 10 + 1);
  });

  data.metadata = {
    title: 'Circle Data',
  };
  return data;
};

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
    node.defaultStyle.size =
      ((node[propertyName] - minp) / rangepLength) * rangevLength +
      visualRange[0];
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

export const MiserablesData = () =>
  fetch(
    'https://gist.githubusercontent.com/emanueles/1dc73efc65b830f111723e7b877efdd5/raw/2c7a42b5d27789d74c8708e13ed327dc52802ec6/lesmiserables.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const { nodes, links } = data;
      const newData = {
        nodes,
        edges: links,
      };
      return newData;
    });

export const NetworkData = () =>
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/da5a1b47-37d6-44d7-8d10-f3e046dabf82.json',
  )
    .then((res) => res.json())
    .then((data) => {
      data.nodes.forEach((node) => {
        node.label = node.olabel;
        node.degree = 0;
        node.defaultStyle = {};
        node.defaultStyle.fontSize = 6;
        data.edges.forEach((edge) => {
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
      nodes.forEach((n) => {
        n.defaultStyle = {};
        n.y = -n.y + 1000;
        n.x += 2000;
        n.degree = 0;
        n.inDegree = 0;
        n.outDegree = 0;
      });
      // compute the degree of each node
      const nodeIdMap = new Map();
      nodes.forEach((node) => {
        nodeIdMap.set(node.id, node);
      });
      edges.forEach((e) => {
        const source = nodeIdMap.get(e.source);
        const target = nodeIdMap.get(e.target);
        source.outDegree++;
        target.inDegree++;
        source.degree++;
        target.degree++;
        e.style = {};
        e.style.width = 0.3;
      });
      mapNodeSize(nodes, 'degree', [2, 20]);
      data.metadata = {
        title: 'Trade Data',
      };
      return data;
    });
};

export const NetworkData2 = () =>
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/0b9730ff-0850-46ff-84d0-1d4afecd43e6.json',
  )
    .then((res) => res.json())
    .then((data) => {
      data.nodes.forEach((node) => {
        node.label = node.olabel;
        node.degree = 0;
        node.defaultStyle = {};
        node.defaultStyle.fontSize = 1.3;
        data.edges.forEach((edge) => {
          if (edge.source === node.id || edge.target === node.id) {
            node.degree++;
          }
        });
      });
      mapNodeSize(data.nodes, 'degree', [1, 15]);
      data.metadata = {
        title: 'Large Data',
      };
      return data;
    });
