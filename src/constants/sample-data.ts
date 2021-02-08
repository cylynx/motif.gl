/* eslint-disable no-restricted-properties */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/camelcase */

import { EdgeStyle, NodeStyle, Utils } from '@antv/graphin';
import { IUserEdge, IUserNode } from '@antv/graphin/lib/typings/type';
import { GraphData } from '../redux/graph';
import {
  mapNodeSize,
  styleNodeSize,
} from '../containers/Graph/styles/StyleNodes';
import { DEFAULT_EDGE_STYLE, edgeFontColor } from './graph-shapes';

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

        // set label values
        const labelStyle: Partial<NodeStyle['label']> = { value: node.olabel };
        node.style.label = labelStyle;

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
        Object.assign(e.style, { keyshape });
      });
      mapNodeSize(nodes, 'degree', [2, 20]);
      data.metadata = {
        title: "Airline's Data",
      };
      return data;
    });
};
