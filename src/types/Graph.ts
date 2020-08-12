import { Node as GraphinNode, Edge as GraphinEdge } from '@antv/graphin/';

export interface Edge extends Omit<GraphinEdge, 'style'> {
  style: Partial<GraphinEdge['style']>;
}

export interface Node extends Omit<GraphinNode, 'data'> {
  data: Partial<GraphinNode['data']> & {
    [property: string]: any;
  };
}

export interface Metadata {
  key: number;
  search_size?: number;
  retrieved_size?: number;
  title?: string;
}

export interface Data {
  nodes: Node[];
  edges: Edge[];
  metadata?: Metadata;
}

const x: TimeSeries = [
  [1, 2],
  [3, 4],
].sort((a, b) => a[0] - b[0]);

export type TimeRange = [number, number];
export type TimeSeries = Array<[number, number]> | [];
export type TimeSeries2 = Array<[number, number]> | [];
export type GetEdgeNumber = (edge: Edge) => number | number[];
export type GetEdgeString = (edge: Edge) => string;
export type GetNodeString = (node: Node) => string;

export interface GetFns {
  getEdgeSource?: GetEdgeString;
  getEdgeTarget?: GetEdgeString;
  getEdgeID?: GetEdgeString;
  getEdgeSourceAdd?: GetEdgeString;
  getEdgeTargetAdd?: GetEdgeString;
  getEdgeLabel?: GetEdgeString;
  getEdgeTime?: GetEdgeNumber;
  getEdgeScore?: GetEdgeNumber;
  getEdgeWidth?: GetEdgeNumber;
  getNodeID?: GetNodeString;
  getNodeLabel?: GetNodeString;
}

export interface Layout {
  name: 'concentric' | 'force' | 'radial' | 'grid' | 'dagre' | 'circle';
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface StyleOptions {
  layout: Layout;
  nodeSize: string;
  edgeWidth: string;
  resetView: boolean;
  groupEdges: boolean;
}

export interface ChartData {
  name: string;
  value: number;
}
