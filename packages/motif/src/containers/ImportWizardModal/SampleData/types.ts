export enum SampleData {
  SIMPLE_GRAPH,
  CIRCLE_GRAPH,
  RANDOM_GRAPH,
  BANK,
  NETWORK,
  MISERABLE,
  AA,
}

export type SampleDataItem = {
  data: () => void;
  title: string;
  description: string;
  key: SampleData;
  src: string;
  type: 'json' | 'edgeListCsv' | 'nodeEdgeCsv';
};
