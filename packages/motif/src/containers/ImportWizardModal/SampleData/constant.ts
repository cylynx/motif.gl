import { SampleData, SampleDataItem } from './types';

import * as DATA from '../../../constants/sample-data';
import { Accessors } from '../../../redux/graph';

export const sampleData: SampleDataItem[] = [
  {
    data: DATA.CircleData,
    title: 'Circle Graph',
    description:
      'Try displaying the data as a circle using one of the layout options.',
    key: SampleData.CIRCLE_GRAPH,
    type: 'json',
    src: 'https://storage.googleapis.com/cylynx-landing-content/circle-data.png',
  },
  {
    data: DATA.TwoDataArray,
    title: 'Random + Circle',
    description: 'Import multiple data as in this example.',
    key: SampleData.SIMPLE_GRAPH,
    type: 'json',
    src: 'https://storage.googleapis.com/cylynx-landing-content/circle-random-data.png',
  },
  {
    data: DATA.BankData,
    title: 'Banking Connections',
    description:
      'Sample banking data with transfer, ownership, payments connections and rich data types. Use a sequential layout and try out the time-series filters and playback.',
    key: SampleData.BANK,
    type: 'json',
    src: 'https://storage.googleapis.com/cylynx-landing-content/bank-connections.png',
  },
  {
    data: DATA.MiserablesData,
    title: 'Les Misérables',
    description:
      'Character co-occurence in Les Misérables. Try coloring the grouping and displaying the data using a force-directed plot.',
    type: 'json',
    key: SampleData.MISERABLE,
    src: 'https://storage.googleapis.com/cylynx-landing-content/miserables-data.png',
  },
  {
    data: DATA.NetworkData,
    title: 'Authorship',
    description:
      'Co-authorship network of scientists working on network theory. 1.5k nodes and 2.7k edges.',
    type: 'json',
    key: SampleData.NETWORK,
    src: 'https://storage.googleapis.com/cylynx-landing-content/network-data.png',
  },
  {
    data: DATA.AAData,
    title: 'American Airlines',
    description:
      'Aggregated arrival and departure flights laid out as a U.S. map.',
    type: 'json',
    key: SampleData.AA,
    src: 'https://storage.googleapis.com/cylynx-landing-content/aa-data.png',
  },
];

export const defaultAccessors: Accessors = {
  nodeID: 'id',
  edgeSource: 'source',
  edgeTarget: 'target',
};
